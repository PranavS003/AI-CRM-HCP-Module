from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import (
    init_db,
    get_all_interactions,
    get_interaction,
    update_interaction,
    delete_interaction,
    search_interactions,
)

from langgraph_agent import graph

app = FastAPI(title="AI CRM Backend")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AgentRequest(BaseModel):
    text: str


class InteractionUpdate(BaseModel):
    doctor_name: str = ""
    hospital: str = ""
    meeting_type: str = ""
    product: str = ""
    sentiment: str = ""
    materials_shared: str = ""
    follow_up: str = ""


@app.get("/")
def home():
    return {
        "status": "running",
        "service": "AI CRM Backend",
    }


@app.post("/agent")
def agent(request: AgentRequest):
    result = graph.invoke(
        {
            "text": request.text
        }
    )

    return result["result"]


@app.get("/interactions")
def interactions():
    return get_all_interactions()


@app.get("/interaction/{interaction_id}")
def interaction(interaction_id: int):
    data = get_interaction(interaction_id)

    if not data:
        raise HTTPException(status_code=404, detail="Interaction not found")

    return data


@app.put("/interaction/{interaction_id}")
def edit_interaction(
    interaction_id: int,
    interaction: InteractionUpdate,
):
    existing = get_interaction(interaction_id)

    if not existing:
        raise HTTPException(status_code=404, detail="Interaction not found")

    update_interaction(
        interaction_id,
        interaction.model_dump(),
    )

    return {
        "success": True,
        "message": "Interaction updated",
    }


@app.delete("/interaction/{interaction_id}")
def remove_interaction(interaction_id: int):
    existing = get_interaction(interaction_id)

    if not existing:
        raise HTTPException(status_code=404, detail="Interaction not found")

    delete_interaction(interaction_id)

    return {
        "success": True,
        "message": "Interaction deleted",
    }


@app.get("/search")
def search(keyword: str):
    return search_interactions(keyword)