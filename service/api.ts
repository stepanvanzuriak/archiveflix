export const fetcher = (url: string, headers: HeadersInit = {}) =>
  fetch(url, {
    headers,
    next: { revalidate: 3600 },
  }).then((r) => r.json());

export const getItems = (
  filters: {
    collection?: string;
    subject?: string;
    creator?: string;
    title?: string;
  },
  page: number = 1,
  opts: { sort?: string; rows?: string } = {},
): string => {
  const options = {
    rows: "12",
    sort: "num_reviews desc",
    ...opts,
    page,
  };

  const params = new URLSearchParams({
    ...(filters.collection && { collection: filters.collection }),
    ...(filters.subject && { subject: filters.subject }),
    ...(filters.creator && { creator: filters.creator }),
    ...(filters.title && { title: filters.title }),
    page: options.page.toString(),
    rows: options.rows,
    sort: options.sort,
  });

  return `/api/archive/search?${params.toString()}`;
};

export const getItem = (id: string) => {
  const params = new URLSearchParams({ id });

  return `/api/archive/metadata?${params.toString()}`;
};
