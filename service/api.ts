export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const getItems = (
  filters: {
    collection?: string;
    subject?: string;
    creator?: string;
  },
  page: number = 1,
  opts: { sort?: string; rows?: string } = {},
): string => {
  const options = {
    rows: "12",
    fields: "identifier",
    page,
    sort: "num_reviews desc",
    ...opts,
  };

  return `https://archive.org/advancedsearch.php?q=collection%3A%28${filters.collection}%29&fl%5B%5D=identifier&rows=${options.rows}&page=${options.page}&output=json&sort%5B%5D=${options.sort}`;
};

export const getItem = (id: string) => {
  return `https://archive.org/metadata/${id}`;
};
