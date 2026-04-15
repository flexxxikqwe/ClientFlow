export async function safeJson(response: Response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const text = await response.text();
    if (text) {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON", e);
        return null;
      }
    }
  }
  return null;
}
