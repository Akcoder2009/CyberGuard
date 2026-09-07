def calculate_risk(features: dict):
    score = 0
    signals = []

    if features["scheme"] != "https":
        score += 10
        signals.append("No HTTPS")

    if len(features["domain"] or "") > 30:
        score += 10
        signals.append("Unusually long domain")

    if len(features["path"]) > 50:
        score += 5
        signals.append("Unusually long path")

    if len(features["query"]) > 100:
        score += 5
        signals.append("Large query string")

    score = min(score, 100)

    if score < 30:
        classification = "low_risk"
    elif score < 60:
        classification = "suspicious"
    elif score < 80:
        classification = "high_risk"
    else:
        classification = "likely_phishing"

    return {
        "risk_score": score,
        "classification": classification,
        "signals": signals
    }
    