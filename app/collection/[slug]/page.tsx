import { Suspense } from "react";

import NextPage from "@/components/next-page";
import ListControls from "@/components/list-controls";
import Loading from "@/components/loading";
import Videos from "@/components/videos";
import { topicParser } from "@/utils";

export default async function Cartoons({
  searchParams,
  params,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string; sort: string }>;
}) {
  const { slug } = await params;
  const { page, sort } = await searchParams;
  const currentPage = page || "1";
  const currentSort = sort || "num_reviews desc";

  return (
    <section className="h-full flex flex-col gap-4">
      <h2 className="text-3xl text-primary">{topicParser(slug)}</h2>
      <ListControls />

      <Suspense fallback={<Loading className="flex-grow" />}>
        <Videos
          collection={slug}
          currentPage={currentPage}
          currentSort={currentSort}
        />
      </Suspense>

      <NextPage />
    </section>
  );
}
