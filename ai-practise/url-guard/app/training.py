def get_training_mission(employee: str):
    return {
        "employee": employee,
        "mission": "Identify the phishing attempt",
        "scenario": (
            "You receive an unexpected message asking you to verify "
            "your account through a link."
        ),
        "correct_action": "Report the message and do not open the link.",
        "starting_score": 58
    }


def complete_training(employee: str):
    return {
        "employee": employee,
        "training_completed": True,
        "previous_score": 58,
        "new_score": 84,
        "improvement": 26
    }