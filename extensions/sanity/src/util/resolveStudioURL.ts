export function resolveStudioURL(studioId: string | null): string {
  if (!studioId) {
    return "";
  }
  if (studioId.startsWith("https://")) {
    return studioId;
  }
  return `https://${studioId}.sanity.studio`;
}
