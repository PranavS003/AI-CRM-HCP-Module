import json
import re
from typing import TypedDict

from langgraph.graph import StateGraph, END

from groq_client import ask_ai
from database import search_interactions
from tools import (
    log_interaction,
    edit_interaction,
    search_interaction,
    generate_summary,
    suggest_follow_up,
)


class AgentState(TypedDict):
    text: str
    result: dict


def extract_id(text: str):
    """
    Fallback only: only treat a number as an explicit interaction id
    if it's clearly LABELED as one — e.g. "interaction 4", "id 4",
    "#4". A bare number sitting in the sentence for another reason
    (like a dosage, "CardioPlus 40 mg") must NOT be mistaken for an
    id, or edits/follow-ups get pointed at the wrong record.
    """
    match = re.search(
        r"\b(?:interaction|id)\s*[:\-#]?\s*(\d+)\b|#(\d+)\b",
        text,
        re.IGNORECASE,
    )

    if not match:
        return None

    number = match.group(1) or match.group(2)
    return int(number)


ROUTER_PROMPT = """
You are the routing brain for an AI-first Healthcare CRM assistant.

A field representative just sent this message:

"{text}"

Decide which ONE tool should handle it, and (if relevant) which
existing interaction it refers to.

Tools:
- "log_interaction": the user is describing a NEW HCP interaction
  that just happened (e.g. "Today I met Dr Smith and discussed
  Product X, sentiment was positive").
- "edit_interaction": the user wants to CHANGE or CORRECT details of
  an interaction that was already logged (e.g. "change Dr Smith to
  Dr John", "update the sentiment to negative", "fix the hospital
  name for that last entry").
- "search_interaction": the user wants to find/look up existing
  interactions (e.g. "find interactions with Dr Smith", "show me
  meetings about Product X", "interactions with Dr Smith", "history
  of Dr Smith").
- "generate_summary": the user wants an overview/report of all
  interactions.
- "suggest_follow_up": the user wants follow-up action suggestions
  for a specific interaction.

Also extract a short "target" string that identifies WHICH interaction
is being referred to (only needed for "edit_interaction" and
"suggest_follow_up"). IMPORTANT: if the target is a person, return
ONLY their surname/last name with NO title (write "Smith", not "Dr
Smith" or "Dr. Smith") so it can be matched regardless of how the
title was punctuated when originally logged. If the message doesn't
refer to any specific existing interaction, set target to null.

If (and only if) the tool is "search_interaction", also decide a
"detail" flag:
- true  -> the user wants the FULL details / everything logged about
  those interactions (phrases like "interactions with Dr Smith",
  "history of Dr Smith", "show me everything about Dr Smith",
  "full details", "all interactions with Dr Smith").
- false -> the user just wants a quick lookup (phrases like "search
  for Dr Smith", "find Dr Smith", "look up Dr Smith").
For every other tool, set "detail" to false.

Return ONLY valid JSON in this exact shape, nothing else:

{{"tool": "log_interaction", "target": null, "detail": false}}
"""


def route(text: str):
    prompt = ROUTER_PROMPT.format(text=text.replace('"', "'"))

    response = ask_ai(prompt)

    response = (
        response.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        decision = json.loads(response)
    except json.JSONDecodeError:
        # If the LLM ever returns something malformed, fall back to
        # treating the message as a new log rather than crashing.
        decision = {"tool": "log_interaction", "target": None, "detail": False}

    return decision


def resolve_interaction_id(text: str, target: str):
    """
    Figure out which interaction the user means:
    1. An explicit, clearly-labeled id in the message always wins.
    2. Otherwise search by the "target" name/keyword the router
       found and use the most recent match.
    """
    explicit_id = extract_id(text)
    if explicit_id is not None:
        return explicit_id, None

    if target:
        matches = search_interactions(target)
        if matches:
            return matches[0]["id"], None
        return None, f"No logged interaction found matching '{target}'."

    return None, "Please mention the doctor's name so I know which interaction to update."


def agent_node(state: AgentState):

    text = state["text"]

    decision = route(text)
    tool = decision.get("tool", "log_interaction")
    target = decision.get("target")
    detail = decision.get("detail", False)

    if tool == "generate_summary":

        result = generate_summary()

    elif tool == "search_interaction":

        result = search_interaction(target or text)
        # Tell the frontend whether to show the full details or
        # just a short lookup line per interaction.
        result["mode"] = "detailed" if detail else "summary"

    elif tool == "edit_interaction":

        interaction_id, error = resolve_interaction_id(text, target)

        if error:
            result = {
                "tool": "edit_interaction",
                "status": "error",
                "message": error,
            }
        else:
            result = edit_interaction(interaction_id, text)

    elif tool == "suggest_follow_up":

        interaction_id, error = resolve_interaction_id(text, target)

        if error:
            result = {
                "tool": "suggest_follow_up",
                "status": "error",
                "message": error,
            }
        else:
            result = suggest_follow_up(interaction_id)

    else:

        result = log_interaction(text)

    return {
        "result": result
    }


builder = StateGraph(AgentState)

builder.add_node("agent", agent_node)

builder.set_entry_point("agent")

builder.add_edge("agent", END)

graph = builder.compile()