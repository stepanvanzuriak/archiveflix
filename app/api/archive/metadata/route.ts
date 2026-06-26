import { type NextRequest } from "next/server";

import { getItemMetadata } from "@/service/archive";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  try {
    const data = await getItemMetadata(id as string);

    return Response.json(data);
  } catch {
    return Response.json({ error: "Failed to fetch from archive.org" });
  }
}
