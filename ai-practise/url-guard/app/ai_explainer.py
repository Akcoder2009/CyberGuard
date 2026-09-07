def explain_incident(incident: dict):
    events = incident["events"]
    employee = incident["employee"]
    score = incident["risk_score"]
    severity = incident["severity"]

    entry_point = events[0] if events else "Unknown"

    return {
        "summary": (
            f"{employee} is involved in a {severity} security incident "
            f"with a risk score of {score}."
        ),

        "likely_entry_point": entry_point,

        "attack_sequence": " → ".join(events),

        "why_concerning": (
            "The activity shows a progression from suspicious authentication "
            "to privilege escalation, administrative access, sensitive data "
            "access, and data transfer."
        ),

        "affected_systems": incident["affected_systems"],

        "recommended_actions": [
            "Lock the affected account",
            "Revoke active sessions",
            "Review authentication activity",
            "Restrict suspicious access",
            "Investigate sensitive data access"
        ],

        "confidence": "high"
    }