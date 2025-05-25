import { Suspense } from "react";

import NextPage from "@/components/next-page";
import ListControls from "@/components/list-controls";
import Videos from "@/components/videos";
import Loading from "@/components/loading";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string; sort: string }>;
}) {
  const params = await searchParams;
  const currentPage = params.page || "1";
  const currentSort = params.sort || "num_reviews desc";

  return (
    <section className="h-full flex flex-col gap-4">
      <ListControls />

      <Suspense fallback={<Loading className="flex-grow" />}>
        <Videos
          collection="feature_films"
          currentPage={currentPage}
          currentSort={currentSort}
        />
      </Suspense>

      <NextPage />
    </section>
  );
}
