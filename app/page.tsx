import clsx from "clsx";

import CollectionView from "@/components/collection/collection-view";
import HomeSearch from "@/components/layout/home-search";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string; sort: string; search: string }>;
}) {
  const params = await searchParams;

  return (
    <section
      className={clsx("h-full flex flex-col gap-4", {
        "items-center justify-center": !params.search,
      })}
    >
      {params.search ? <CollectionView params={params} /> : <HomeSearch />}
    </section>
  );
}
