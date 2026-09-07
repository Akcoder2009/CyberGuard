def calculate_employee_risk(incident: dict):
    score = incident["risk_score"]

    if score >= 80:
        level = "critical"
    elif score >= 60:
        level = "high"
    elif score >= 30:
        level = "medium"
    else:
        level = "low"

    return {
        "employee": incident["employee"],
        "risk_score": score,
        "risk_level": level,
        "incident_count": 1,
        "reason": "High-risk security activity detected"
    }