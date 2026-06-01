export function formatVariant(variant: {
  size: string | null;
  color: string | null;
}): string {
  return [variant.size, variant.color].filter(Boolean).join(" / ");
}
