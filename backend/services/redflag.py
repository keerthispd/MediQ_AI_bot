from typing import Tuple, List

RED_FLAG_KEYWORDS = {
    "chest pain": "emergency",
    "shortness of breath": "emergency",
    "severe bleeding": "emergency",
    "loss of consciousness": "emergency",
    "sudden weakness": "emergency",
    "stroke": "emergency",
    "vision loss": "emergency",
    "suicidal": "emergency",
}


def detect_redflags(message: str) -> Tuple[bool, List[Tuple[str, str]]]:
    """Detect red-flag phrases and return (has_redflag, list of (phrase, severity))."""
    found = []
    lower = message.lower()
    for phrase, severity in RED_FLAG_KEYWORDS.items():
        if phrase in lower:
            found.append((phrase, severity))
    return (len(found) > 0), found
