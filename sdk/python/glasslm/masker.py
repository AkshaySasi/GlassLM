"""
Core masking engine for glasslm.
Ports the TypeScript masker.ts logic to Python.
"""

import re
from typing import List, Optional, Callable, Tuple
from .types import MaskedItem, MaskResult


def _is_valid_luhn(card_number: str) -> bool:
    """Luhn algorithm for credit card validation."""
    digits = re.sub(r'\D', '', card_number)
    if len(digits) < 13 or len(digits) > 19:
        return False

    total = 0
    is_even = False
    for i in range(len(digits) - 1, -1, -1):
        digit = int(digits[i])
        if is_even:
            digit *= 2
            if digit > 9:
                digit -= 9
        total += digit
        is_even = not is_even

    return total % 10 == 0


# Context keywords for confidence analysis
_CONTEXT_KEYWORDS = {
    "api_key": {
        "positive": ["key", "api", "token", "secret", "credential", "auth", "app"],
        "negative": ["array", "index", "hash", "version", "code"],
    },
    "phone": {
        "positive": ["call", "phone", "mobile", "number", "contact", "tel"],
        "negative": ["code", "error", "line", "port", "id"],
    },
    "email": {
        "positive": ["email", "mail", "contact", "address"],
        "negative": [],
    },
    "credit_card": {
        "positive": ["card", "payment", "credit", "debit", "visa", "mastercard"],
        "negative": ["id", "number", "code"],
    },
}


def _analyze_context(text: str, match_index: int, match_length: int, entity_type: str) -> str:
    """Returns 'high', 'medium', or 'low' confidence based on surrounding context."""
    window = 40
    before = text[max(0, match_index - window):match_index].lower()
    after = text[match_index + match_length:match_index + match_length + window].lower()

    score = 0.5
    keywords = _CONTEXT_KEYWORDS.get(entity_type, {})

    for kw in keywords.get("positive", []):
        if kw in before or kw in after:
            score += 0.15

    for kw in keywords.get("negative", []):
        if kw in before or kw in after:
            score -= 0.25

    if score >= 0.85:
        return "high"
    elif score >= 0.6:
        return "medium"
    return "low"


# (pattern, entity_type, prefix, base_confidence, require_context, validator)
_PATTERNS: List[Tuple] = [
    # API Keys - high confidence prefixes
    (re.compile(r'\b(sk|pk)[-_][a-zA-Z0-9]{20,}'), "api_key", "API_KEY", "high", False, None),
    # Context-aware API key
    (re.compile(r'\b(?:my|the|your|this|our)\s+(?:app(?:lication)?\s+)?api\s+key\s+(?:is|:|=)?\s*[\'"]?([a-zA-Z0-9]{16,})[\'"]?', re.IGNORECASE), "api_key", "API_KEY", "medium", True, None),
    # Simple api key pattern
    (re.compile(r'\bapi\s+key[:\s]+([a-zA-Z0-9]{14,})\b', re.IGNORECASE), "api_key", "API_KEY", "high", False, None),
    # API key assignment
    (re.compile(r'\bapi[-_]?key[-_:=]\s*[\'"]?([a-zA-Z0-9]{16,})[\'"]?', re.IGNORECASE), "api_key", "API_KEY", "high", False, None),
    # Env variable style API_KEY
    (re.compile(r'\bAPI_KEY\s*[=:]\s*[\'"]?([a-zA-Z0-9]{16,})[\'"]?'), "api_key", "API_KEY", "high", False, None),
    # JWT tokens
    (re.compile(r'\beyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+'), "access_token", "JWT", "high", False, None),
    # Bearer tokens
    (re.compile(r'\b(Bearer|Token)[\s:]+[a-zA-Z0-9_-]{20,}', re.IGNORECASE), "access_token", "TOKEN", "high", False, None),
    # AWS Access Key
    (re.compile(r'\bAKIA[0-9A-Z]{16}\b'), "cloud_credential", "AWS_KEY", "high", False, None),
    # Private keys
    (re.compile(r'-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]{50,}?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----'), "private_key", "PRIVATE_KEY", "high", False, None),
    # Database URLs
    (re.compile(r'\b(?:mongodb|postgresql|postgres|mysql)://[^\s\'"]+', re.IGNORECASE), "database_url", "DB_URL", "high", False, None),
    # IPv4
    (re.compile(r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'), "ip_address", "IP", "high", False, None),
    # Email
    (re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'), "email", "EMAIL", "high", False, None),
    # Phone
    (re.compile(r'(?:\+?1[-.\s]?)?(?:\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}'), "phone", "PHONE", "high", False, None),
    # SSN
    (re.compile(r'\b\d{3}-\d{2}-\d{4}\b'), "ssn", "SSN", "high", False, None),
    # Credit card (with Luhn)
    (re.compile(r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b'), "credit_card", "CARD", "high", False, _is_valid_luhn),
    # Names (context-dependent)
    (re.compile(r'\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b'), "name", "NAME", "medium", True, None),
]


def auto_mask(text: str) -> MaskResult:
    """
    Detects and masks sensitive data in text.
    Returns a MaskResult with masked text and list of MaskedItems.
    """
    masked_items: List[MaskedItem] = []
    masked_text = text
    counters: dict = {}

    for pattern, entity_type, prefix, base_confidence, require_context, validator in _PATTERNS:
        for match in pattern.finditer(text):
            match_str = match.group(0)
            match_index = match.start()

            # Skip if already masked with the same value
            existing = next((item for item in masked_items if item.original == match_str), None)
            if existing:
                masked_text = masked_text.replace(match_str, existing.placeholder)
                continue

            # Luhn or other validator
            if validator and not validator(match_str):
                continue

            # Context analysis
            confidence = base_confidence
            if require_context:
                confidence = _analyze_context(text, match_index, len(match_str), entity_type)
                if confidence == "low":
                    continue

            counters[prefix] = counters.get(prefix, 0) + 1
            placeholder = f"[[{prefix}_{counters[prefix]}]]"

            masked_items.append(MaskedItem(
                id=f"{entity_type}_{counters[prefix]}",
                original=match_str,
                placeholder=placeholder,
                type=entity_type,
                confidence=confidence,
            ))

            masked_text = masked_text.replace(match_str, placeholder)

    return MaskResult(masked_text=masked_text, masked_items=masked_items)


def mask(text: str) -> MaskResult:
    """Alias for auto_mask. Main public API."""
    return auto_mask(text)


def unmask(text: str, masked_items: List[MaskedItem]) -> str:
    """Restore original values from a masked text using the masked_items map."""
    result = text
    for item in masked_items:
        result = result.replace(item.placeholder, item.original)
    return result
