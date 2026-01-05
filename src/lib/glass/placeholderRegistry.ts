import { MaskedItem } from './types';

// Session-level placeholder registry (memory only)
// This persists across messages within a session but is lost on tab close

export type PlaceholderRegistry = {
  mappings: Map<string, string>; // original -> placeholder
  reverseMappings: Map<string, string>; // placeholder -> original
  typeCounters: Record<string, number>;
};

// Singleton instance for the session
let registry: PlaceholderRegistry = {
  mappings: new Map(),
  reverseMappings: new Map(),
  typeCounters: {},
};

export function getRegistry(): PlaceholderRegistry {
  return registry;
}

export function registerMapping(original: string, placeholder: string): void {
  registry.mappings.set(original, placeholder);
  registry.reverseMappings.set(placeholder, original);
}

export function getPlaceholderForValue(original: string): string | undefined {
  return registry.mappings.get(original);
}

export function getOriginalForPlaceholder(placeholder: string): string | undefined {
  return registry.reverseMappings.get(placeholder);
}

export function getNextCounter(prefix: string): number {
  registry.typeCounters[prefix] = (registry.typeCounters[prefix] || 0) + 1;
  return registry.typeCounters[prefix];
}

export function getRegistrySnapshot(): Record<string, string> {
  const snapshot: Record<string, string> = {};
  registry.mappings.forEach((placeholder, original) => {
    snapshot[original] = placeholder;
  });
  return snapshot;
}

export function clearRegistry(): void {
  registry = {
    mappings: new Map(),
    reverseMappings: new Map(),
    typeCounters: {},
  };
}

// Register items from a masking operation
export function registerMaskedItems(items: MaskedItem[]): void {
  for (const item of items) {
    registerMapping(item.original, item.placeholder);
  }
}
