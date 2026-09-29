import { getPublicContent } from "./content.functions";

// Retries transient network failures (e.g. "Failed to fetch" during reloads).
export async function loadPublicContent() {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await getPublicContent();
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastError;
}
