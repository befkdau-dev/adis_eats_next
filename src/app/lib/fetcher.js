export async function fetcher(url) {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("error occuered while fetching the data");
    error.status = res.status;
    try {
      error.info = await res.json();
    } catch {
      error.info = null;
    }
    throw error;
  }

  return res.json();
}
