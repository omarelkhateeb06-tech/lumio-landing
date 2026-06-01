// Small, presentation-only string helpers shared across surfaces.

export function truncateEmail(email: string, max = 20): string {
  if (email.length <= max) return email;
  return email.slice(0, max) + "…";
}
