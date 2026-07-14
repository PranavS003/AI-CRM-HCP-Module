EXTRACT_INTERACTION_PROMPT = """
Extract the following information from the text.

Return ONLY valid JSON.

Fields:

doctor_name
hospital
meeting_type
product
sentiment
materials_shared
follow_up

Text:

{text}
"""