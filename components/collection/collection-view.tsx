import { Suspense } from "react";

import Loading from "../layout/loading";
import Videos from "../video/videos-list";

import ListControls from "./list-controls";

import { topicParser } from "@/utils";

export default function CollectionView({
  collection,
  params,
}: {
  collection?: string;
  params: { page: string; sort: string; search: string };
}) {
  const currentPage = params.page || "1";
  const currentSort = params.sort || "num_reviews desc";
  const currentSearch = params.search || "";

  return (
    <>
      {collection && <h2 className="text-3xl">{topicParser(collection)}</h2>}
      <ListControls />

      <Suspense fallback={<Loading className="flex-grow" />}>
        <Videos
          collection={collection}
          currentPage={currentPage}
          currentSort={currentSort}
          currentSearch={currentSearch}
        />
      </Suspense>
    </>
  );
}
