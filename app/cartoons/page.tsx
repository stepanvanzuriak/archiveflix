import { getItem, getItems } from "@/service/api";
import NextPage from "@/components/next-page";
import VideosList from "@/components/videos-list";

export default async function Cartoons({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const params = await searchParams;
  const currentPage = params.page || "1";

  const data = await getItems(
    {
      collection: "animationandcartoons",
    },
    Number(currentPage),
  );

  const movies = await Promise.all(
    data.response.docs.map(({ identifier }) => getItem(identifier as string)),
  );

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <VideosList movies={movies} />
      <NextPage />
    </section>
  );
}
