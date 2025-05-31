import CollectionView from "@/components/collection/collection-view";

export default async function Cartoons({
  searchParams,
  params,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string; sort: string; search: string }>;
}) {
  const { slug } = await params;
  const { page, sort, search } = await searchParams;

  return (
    <section className="h-full flex flex-col gap-4">
      <CollectionView collection={slug} params={{ page, sort, search }} />
    </section>
  );
}
