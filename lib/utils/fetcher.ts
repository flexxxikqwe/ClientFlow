export const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object if it's JSON
    if (isJson) {
      try {
        (error as any).info = await res.json();
      } catch (e) {
        // Fallback if parsing fails
      }
    }
    (error as any).status = res.status;
    throw error;
  }

  if (!isJson) {
    throw new Error('Expected JSON response but received something else.');
  }

  return res.json();
};
