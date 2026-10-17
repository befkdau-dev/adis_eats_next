export async function fetcher(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    const error = new Error(
      data?.error?.message ||
        data?.message ||
        `Request failed with status ${response.status}`,
    );

    error.status = response.status;
    error.info = data;

    throw error;
  }

  return data;
}
