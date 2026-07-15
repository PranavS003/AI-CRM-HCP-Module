import json

from groq_client import ask_ai

from database import (
    save_interaction,
    get_all_interactions,
    get_interaction,
    update_interaction,
    search_interactions,
)


def log_interaction(text: str):
    """
    Tool 1
    Extract interaction details using Groq
    and save them into SQLite.
    """

    prompt = f"""
Extract the following fields.

Return ONLY valid JSON.

doctor_name
hospital
meeting_type
product
topics_discussed
sentiment
materials_shared
outcomes
follow_up

Rules:
- topics_discussed should briefly summarize the discussion.
- outcomes should describe the meeting outcome or decision.
- Return empty strings for missing fields.

Text:

{text}
"""

    response = ask_ai(prompt)

    response = (
        response.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    data = json.loads(response)

    interaction_id = save_interaction(data)

    return {
        "tool": "log_interaction",
        "status": "success",
        "interaction_id": interaction_id,
        "data": data,
    }


def edit_interaction(interaction_id: int, instruction: str):
    """
    Tool 2
    Update an existing interaction.
    Only the fields the user asks to change are modified —
    everything else is preserved exactly as it was.
    """

    current = get_interaction(interaction_id)

    if not current:
        return {
            "tool": "edit_interaction",
            "status": "error",
            "message": "Interaction not found",
        }

    prompt = f"""
Current Interaction

{json.dumps(current, indent=2)}

User Request

{instruction}

Return a JSON object containing ONLY the fields that need to change
based on the user's request above. Do NOT include fields that were
not mentioned or implied by the request. Do NOT include "id" or
"created_at". Return ONLY valid JSON, nothing else.
"""

    response = ask_ai(prompt)

    response = (
        response.replace("```json", "")
        .replace("```", "")
        .strip()
    )

    changed_fields = json.loads(response)

    # Merge AI's changes into the existing record so nothing
    # else gets lost, even if the AI accidentally returns extra
    # or missing fields.
    merged = {**current, **changed_fields}

    update_interaction(interaction_id, merged)

    return {
        "tool": "edit_interaction",
        "status": "success",
        "data": merged,
    }


def search_interaction(keyword: str):
    """
    Tool 3
    Search interactions from SQLite.
    """

    results = search_interactions(keyword)

    return {
        "tool": "search_interaction",
        "status": "success",
        "count": len(results),
        "results": results,
    }


def generate_summary(target: str = None):
    """
    Tool 4
    Summarize interactions using Groq.

    If "target" is given (a doctor name or keyword), only that
    person's interactions are summarized. Otherwise, every logged
    interaction across every doctor is summarized.
    """

    if target:
        interactions = search_interactions(target)
    else:
        interactions = get_all_interactions()

    if not interactions:
        message = (
            f"No interactions found for '{target}'."
            if target
            else "No interactions available."
        )

        return {
            "tool": "generate_summary",
            "status": "success",
            "target": target,
            "summary": message,
        }

    scope_line = (
        f"These are all interactions involving {target}."
        if target
        else "These are all logged interactions across every doctor."
    )

    prompt = f"""
Summarize these HCP interactions.

{scope_line}

Focus on

- doctors visited
- hospitals
- products discussed
- overall sentiment
- follow-up actions

Interactions

{json.dumps(interactions, indent=2)}
"""

    summary = ask_ai(prompt)

    return {
        "tool": "generate_summary",
        "status": "success",
        "target": target,
        "summary": summary,
    }


def suggest_follow_up(interaction_id: int):
    """
    Tool 5
    Generate AI follow-up suggestions.
    """

    interaction = get_interaction(interaction_id)

    if not interaction:
        return {
            "tool": "suggest_follow_up",
            "status": "error",
            "message": "Interaction not found",
        }

    prompt = f"""
You are an expert pharmaceutical CRM assistant.

Based on this interaction

{json.dumps(interaction, indent=2)}

Suggest 3 practical follow-up actions.

Return as bullet points.
"""

    suggestions = ask_ai(prompt)

    return {
        "tool": "suggest_follow_up",
        "status": "success",
        "suggestions": suggestions,
    }