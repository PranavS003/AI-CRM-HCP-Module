EXTRACT_INTERACTION_PROMPT = """
Extract the following information from the text.

Return ONLY valid JSON.

Fields:

doctor_name
hospital
meeting_type
product
topics_discussed
sentiment
materials_shared
outcomes
follow_up

Rules:
- topics_discussed should briefly summarize the main discussion.
- outcomes should describe the result or agreement reached during the meeting.
- If a field is unavailable, return an empty string.

Text:

{text}
"""