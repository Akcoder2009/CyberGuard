def calculate_organization_risk(employees: list[dict]):
    if not employees:
        return {
            "organization_risk_score": 0,
            "risk_level": "low",
            "employees": []
        }

    average_score = sum(
        employee["risk_score"] for employee in employees
    ) / len(employees)

    score = round(average_score)

    if score >= 80:
        level = "critical"
    elif score >= 60:
        level = "high"
    elif score >= 30:
        level = "medium"
    else:
        level = "low"

    return {
        "organization_risk_score": score,
        "risk_level": level,
        "employees": employees
    }