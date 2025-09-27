import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const collection = req.nextUrl.searchParams.get("collection");
  const subject = req.nextUrl.searchParams.get("subject");
  const creator = req.nextUrl.searchParams.get("creator");
  const page = req.nextUrl.searchParams.get("page");
  const sort = req.nextUrl.searchParams.get("sort");
  const rows = req.nextUrl.searchParams.get("rows");
  const title = req.nextUrl.searchParams.get("title");
  const excludeIds = req.nextUrl.searchParams.get("excludeIds");

  const queryParts = [
    collection ? `collection:(${collection})` : "",
    subject ? `subject:(${subject})` : "",
    creator ? `creator:(${creator})` : "",
    title ? `title:(${title})` : "",
  ].filter(Boolean);

  // Add the filter to include only videos/movies
  queryParts.push("mediatype:movies");

  // Exclude specific IDs if provided
  if (excludeIds) {
    const idsArray = excludeIds.split(",");
    idsArray.forEach((id) => {
      queryParts.push(`NOT identifier:(${id})`);
    });
  }

  const q = queryParts.join(" AND ");

  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}&fl[]=identifier&rows=${rows}&page=${page}&output=json&sort[]=${encodeURIComponent(sort as string)}`;

  const access = process.env.S3!;
  const secret = process.env.S3_SECRET!;
  const authHeader = `LOW ${access}:${secret}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: authHeader,
      },
      next: { revalidate: 3600 },
    });
    const data = await response.json();

    return Response.json(data);
  } catch {
    return Response.json({ error: "Failed to fetch from archive.org" });
  }
}
