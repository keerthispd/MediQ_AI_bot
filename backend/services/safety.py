from typing import Tuple, List

PROHIBITED_TERMS = [
    "self-harm",
    "suicide",
    "kill myself",
    "harm myself",
]


def check_message_for_safety(message: str) -> Tuple[bool, List[str]]:
    """Check message for prohibited content.

    Returns (is_allowed, found_terms).
    If is_allowed is False, the caller should refuse to provide medical advice and
    escalate appropriately.
    """
    lower = message.lower()
    found = [t for t in PROHIBITED_TERMS if t in lower]
    is_allowed = len(found) == 0
    return is_allowed, found
