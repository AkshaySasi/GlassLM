"""Types for the glasslm library."""

from dataclasses import dataclass, field
from typing import List, Literal, Optional


MaskType = Literal["name", "email", "phone", "ssn", "credit_card", "id",
                   "address", "api_key", "access_token", "private_key",
                   "cloud_credential", "ip_address", "database_url"]

Confidence = Literal["high", "medium", "low"]


@dataclass
class MaskedItem:
    """Represents a single masked value and its placeholder."""
    id: str
    original: str
    placeholder: str
    type: MaskType
    confidence: Optional[Confidence] = "medium"


@dataclass
class MaskResult:
    """Result of a mask() call."""
    masked_text: str
    masked_items: List[MaskedItem] = field(default_factory=list)

    @property
    def map(self) -> List[MaskedItem]:
        """Alias for masked_items, for web-SDK style usage."""
        return self.masked_items
