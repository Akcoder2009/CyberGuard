from datetime import datetime, timedelta


def generate_timeline(events: list[str]):
    start_time = datetime.now()

    timeline = []

    for i, event in enumerate(events):
        timeline.append({
            "timestamp": (
                start_time + timedelta(minutes=i)
            ).strftime("%H:%M:%S"),
            "step": i + 1,
            "event": event
        })

    return timeline
