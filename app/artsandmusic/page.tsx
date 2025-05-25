import { Suspense } from "react";

import NextPage from "@/components/next-page";
import ListControls from "@/components/list-controls";
import Loading from "@/components/loading";
import Videos from "@/components/videos";

export default async function ArtsAndMusic({
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
          collection="artsandmusicvideos"
          currentPage={currentPage}
          currentSort={currentSort}
        />
      </Suspense>

      <NextPage />
    </section>
  );
}
