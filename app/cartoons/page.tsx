import { Suspense } from "react";

import NextPage from "@/components/next-page";
import ListControls from "@/components/list-controls";
import Loading from "@/components/loading";
import Videos from "@/components/videos";

export default async function Cartoons({
  searchParams,
}: {
  searchParams: Promise<{ page: string; sort: string }>;
}) {
  const params = await searchParams;
  const currentPage = params.page || "1";
  const currentSort = params.sort || "num_reviews desc";

  return (
    <section className="h-full flex flex-col gap-4">
      <h2 className="text-3xl text-primary">Cartoons</h2>
      <ListControls />

      <Suspense fallback={<Loading className="flex-grow" />}>
        <Videos
          collection="animationandcartoons"
          currentPage={currentPage}
          currentSort={currentSort}
        />
      </Suspense>

      <NextPage />
    </section>
  );
}
