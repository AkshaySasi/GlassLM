"""
glasslm - Privacy guardrail for AI applications.

Masks sensitive PII from text before sending to LLMs,
and restores it from the response.

Usage:
    from glasslm import mask, unmask
    
    result = mask("My email is user@example.com and key is sk-abc123...")
    print(result.masked_text)     # Text with placeholders
    print(result.masked_items)    # List of what was masked
    
    restored = unmask(result.masked_text, result.masked_items)
"""

from .masker import mask, unmask, auto_mask
from .types import MaskedItem, MaskResult

__version__ = "0.1.0"
__all__ = ["mask", "unmask", "auto_mask", "MaskedItem", "MaskResult"]
