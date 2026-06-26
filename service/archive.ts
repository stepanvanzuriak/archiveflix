import { ArchiveFile } from "@/utils";

// Server-only archive.org fetching. This module reads process.env.S3 and must
// never be imported by a client component.

export interface SearchResult {
  response: {
    docs: { identifier: string }[];
    numFound: number;
  };
}

export interface MovieData {
  files: ArchiveFile[];
  metadata: {
    description: string;
    title: string;
    identifier: string;
    creator?: string;
    date?: string;
    subject?: string[];
    genre?: string[];
    language?: string[];
  };
}

const authHeader = () => {
  const access = process.env.S3!;
  const secret = process.env.S3_SECRET!;

  return `LOW ${access}:${secret}`;
};

export const searchItems = async (
  filters: {
    collection?: string;
    subject?: string;
    creator?: string;
    title?: string;
    excludeIds?: string[];
  },
  page: number = 1,
  opts: { sort?: string; rows?: string } = {},
): Promise<SearchResult> => {
  const options = {
    rows: "12",
    sort: "num_reviews desc",
    ...opts,
  };

  const queryParts = [
    filters.collection ? `collection:(${filters.collection})` : "",
    filters.subject ? `subject:(${filters.subject})` : "",
    filters.creator ? `creator:(${filters.creator})` : "",
    filters.title ? `title:(${filters.title})` : "",
  ].filter(Boolean);

  // Only videos/movies
  queryParts.push("mediatype:movies");

  // Exclude specific IDs if provided
  if (filters.excludeIds && filters.excludeIds.length > 0) {
    filters.excludeIds.forEach((id) => {
      queryParts.push(`NOT identifier:(${id})`);
    });
  }

  const q = queryParts.join(" AND ");

  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
    q,
  )}&fl[]=identifier&rows=${options.rows}&page=${page}&output=json&sort[]=${encodeURIComponent(
    options.sort,
  )}`;

  const response = await fetch(url, {
    headers: { Authorization: authHeader() },
    next: { revalidate: 3600 },
  });

  return response.json();
};

export const getItemMetadata = async (id: string): Promise<MovieData> => {
  const response = await fetch(`https://archive.org/metadata/${id}`, {
    headers: { Authorization: authHeader() },
    next: { revalidate: 3600 },
  });

  return response.json();
};
