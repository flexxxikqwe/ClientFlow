export interface FetchError extends Error {
  info?: any;
  status?: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  const text = await res.text();
  let data = null;
  
  if (isJson && text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON response', e);
    }
  }

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.') as FetchError;
    error.info = data || text;
    error.status = res.status;
    throw error;
  }

  return data || text;
};
