export const fetcher = (url: string, headers: HeadersInit = {}) =>
  fetch(url, {
    headers,
    next: { revalidate: 3600 },
  }).then((r) => r.json());

export const getItem = (id: string) => {
  const params = new URLSearchParams({ id });

  return `/api/archive/metadata?${params.toString()}`;
};
