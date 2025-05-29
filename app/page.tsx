import CollectionView from "@/components/collection/collection-view";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page: string; sort: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="h-full flex flex-col gap-4">
      <CollectionView collection="feature_films" params={params} />
    </section>
  );
}
