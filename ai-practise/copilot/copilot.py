import json

with open("incident.json", "r") as file:
    incident = json.load(file)

print(incident)