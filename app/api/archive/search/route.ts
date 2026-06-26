import { type NextRequest } from "next/server";

import { searchItems } from "@/service/archive";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const excludeIds = params.get("excludeIds");

  try {
    const data = await searchItems(
      {
        collection: params.get("collection") || undefined,
        subject: params.get("subject") || undefined,
        creator: params.get("creator") || undefined,
        title: params.get("title") || undefined,
        excludeIds: excludeIds ? excludeIds.split(",") : undefined,
      },
      Number(params.get("page")) || 1,
      {
        sort: params.get("sort") || undefined,
        rows: params.get("rows") || undefined,
      },
    );

    return Response.json(data);
  } catch {
    return Response.json({ error: "Failed to fetch from archive.org" });
  }
}
