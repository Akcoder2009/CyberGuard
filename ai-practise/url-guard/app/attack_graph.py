def generate_attack_graph(incident: dict):
    employee = incident["employee"]
    events = incident["events"]

    nodes = [
        {"id": "ip", "label": "Suspicious IP", "type": "source"},
        {"id": "employee", "label": employee, "type": "employee"},
    ]

    edges = [
        {"source": "ip", "target": "employee"}
    ]

    previous_id = "employee"

    for i, event in enumerate(events):
        node_id = f"event_{i}"

        nodes.append({
            "id": node_id,
            "label": event,
            "type": "event"
        })

        edges.append({
            "source": previous_id,
            "target": node_id
        })

        previous_id = node_id

    return {
        "incident_id": incident["incident_id"],
        "nodes": nodes,
        "edges": edges
    }