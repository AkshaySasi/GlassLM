import { autoMask, unmask, MaskedItem } from '@glasslm/core';

export function mask(text: string): { masked: string; map: MaskedItem[] } {
    const { maskedText, maskedItems } = autoMask(text);
    return { masked: maskedText, map: maskedItems };
}

export function restore(text: string, map: MaskedItem[]): string {
    return unmask(text, map);
}

export type { MaskedItem };
