def create_incident(detections: list[dict]):
    if not detections:
        return {
            "incident_id": None,
            "severity": "low",
            "risk_score": 0,
            "detections": [],
            "status": "no_incident"
        }

    risk_scores = [
        detection.get("risk_score", 0)
        for detection in detections
    ]

    risk_score = min(max(risk_scores), 100)

    if risk_score >= 80:
        severity = "critical"
    elif risk_score >= 60:
        severity = "high"
    elif risk_score >= 30:
        severity = "medium"
    else:
        severity = "low"

    return {
        "incident_id": 1001,
        "severity": severity,
        "risk_score": risk_score,
        "detections": detections,
        "status": "active"
    }