from .attack_simulator import generate_attack
from fastapi import FastAPI
from pydantic import BaseModel
from .url_analyzer import analyze_url
from .risk_engine import calculate_risk
from .ai_explainer import explain_incident
from .containment import lock_account, revoke_sessions
from .training import get_training_mission, complete_training
from .employee_risk import calculate_employee_risk
from .organization_risk import calculate_organization_risk
from .timeline import generate_timeline
from .attack_graph import generate_attack_graph
from .incident_manager import create_incident


app = FastAPI(title="CyberGuard URL Guard")


class URLCheckRequest(BaseModel):
    url: str


class IncidentRequest(BaseModel):
    incident_id: int
    risk_score: int
    severity: str
    employee: str
    events: list[str]
    affected_systems: list[str]


class CopilotQuestionRequest(BaseModel):
    incident: IncidentRequest
    question: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/url-check")
def check_url(request: URLCheckRequest):
    features = analyze_url(request.url)
    risk = calculate_risk(features)

    return {
        "url": request.url,
        "features": features,
        "risk": risk
    }


@app.post("/api/copilot")
def copilot(request: IncidentRequest):
    incident = request.model_dump()
    explanation = explain_incident(incident)

    return {
        "incident": incident,
        "copilot_analysis": explanation
    }


@app.post("/api/copilot/question")
def copilot_question(request: CopilotQuestionRequest):
    incident = request.incident.model_dump()
    question = request.question.lower()

    if "critical" in question or "why" in question:
        answer = (
            f"This incident is {incident['severity']} because the activity "
            "progresses from suspicious authentication to privilege escalation, "
            "administrative access, and sensitive data access."
        )

    elif "entry" in question or "start" in question:
        answer = (
            f"The likely entry point is: {incident['events'][0]}."
            if incident["events"]
            else "The entry point is unknown."
        )

    elif "first" in question or "action" in question:
        answer = (
            "The first recommended actions are to lock the affected account, "
            "revoke active sessions, and review recent authentication activity."
        )

    else:
        answer = (
            "Based on the supplied incident evidence, further investigation "
            "is recommended."
        )

    return {
        "question": request.question,
        "answer": answer
    }

@app.post("/api/simulate-attack")
def simulate_attack():
    incident = generate_attack()

    explanation = explain_incident(incident)

    return {
        "incident": incident,
        "copilot_analysis": explanation
    }

@app.post("/api/containment/lock-account")
def containment_lock(request: IncidentRequest):
    return lock_account(request.employee)


@app.post("/api/containment/revoke-sessions")
def containment_revoke(request: IncidentRequest):
    return revoke_sessions(request.employee)

@app.get("/api/training/mission")
def training_mission(employee: str = "Jane Doe"):
    return get_training_mission(employee)


@app.post("/api/training/complete")
def training_complete(employee: str = "Jane Doe"):
    return complete_training(employee)

@app.post("/api/employee-risk")
def employee_risk(request: IncidentRequest):
    incident = request.model_dump()
    return calculate_employee_risk(incident)

class OrganizationRiskRequest(BaseModel):
    employees: list[dict]


@app.post("/api/organization-risk")
def organization_risk(request: OrganizationRiskRequest):
    return calculate_organization_risk(request.employees)

@app.post("/api/incident-timeline")
def incident_timeline(request: IncidentRequest):
    return {
        "incident_id": request.incident_id,
        "timeline": generate_timeline(request.events)
    }

@app.post("/api/attack-graph")
def attack_graph(request: IncidentRequest):
    incident = request.model_dump()

    return generate_attack_graph(incident)

@app.post("/api/create-incident")
def create_incident_endpoint(detections: list[dict]):
    return create_incident(detections)