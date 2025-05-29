import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const access = process.env.S3!;
  const secret = process.env.S3_SECRET!;
  const authHeader = `LOW ${access}:${secret}`;

  try {
    const response = await fetch(`https://archive.org/metadata/${id}`, {
      headers: {
        Authorization: authHeader,
      },
      next: { revalidate: 3600 },
    });
    const data = await response.json();

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: "Failed to fetch from archive.org" });
  }
}
