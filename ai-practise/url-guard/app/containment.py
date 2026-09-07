def lock_account(employee: str):
    return {
        "action": "lock_account",
        "employee": employee,
        "status": "contained",
        "message": f"Simulated account lock applied to {employee}."
    }


def revoke_sessions(employee: str):
    return {
        "action": "revoke_sessions",
        "employee": employee,
        "status": "contained",
        "message": f"Simulated sessions revoked for {employee}."
    }