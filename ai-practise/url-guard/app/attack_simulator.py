def generate_attack():
    return {
        "incident_id": 1001,
        "risk_score": 91,
        "severity": "critical",
        "employee": "Jane Doe",
        "events": [
            "Unusual login",
            "Multiple failed login attempts",
            "Privilege escalation",
            "Admin API access",
            "Sensitive database access",
            "Large data download"
        ],
        "affected_systems": [
            "Admin API",
            "Customer Database"
        ]
    }