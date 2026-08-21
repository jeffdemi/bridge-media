export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

// Mutation-specific Zod schemas will be added beside their server-side use in
// later phases. No mutation may trust browser input directly.
