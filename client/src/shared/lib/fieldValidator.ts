import { z } from "zod";

export function fieldValidator<T>(schema: z.ZodType<T>) {
  return ({ value }: { value: unknown }) => {
    if (!value) return undefined;
    const result = schema.safeParse(value);
    return result.success ? undefined : result.error.issues[0]?.message;
  };
}
