import { Suspense } from "react";

import Loading from "../layout/loading";
import Videos from "../video/videos-list";

import NextPage from "./next-page";
import ListControls from "./list-controls";

import { topicParser } from "@/utils";

export default function CollectionView({
  collection,
  params,
}: {
  collection: string;
  params: { page: string; sort: string };
}) {
  const currentPage = params.page || "1";
  const currentSort = params.sort || "num_reviews desc";

  return (
    <>
      <h2 className="text-3xl text-primary">{topicParser(collection)}</h2>
      <ListControls />

      <Suspense fallback={<Loading className="flex-grow" />}>
        <Videos
          collection={collection}
          currentPage={currentPage}
          currentSort={currentSort}
        />
      </Suspense>

      <NextPage />
    </>
  );
}
