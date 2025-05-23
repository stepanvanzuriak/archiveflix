import Image from "next/image";
import { Card, CardHeader, CardBody } from "@heroui/card";

import { getItem, getItems } from "@/service/api";
import NextPage from "@/components/next-page";

export default async function Home({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const params = await searchParams;
  const currentPage = params.page || "1";

  const data = await getItems(
    {
      collection: "feature_films",
    },
    Number(currentPage),
  );

  // GET VIDEO
  // const data2 = await getItemTest();
  // const testFile = data2.files.filter(({ format }) => format === "h.264")[0]
  //   .name;

  const testItems = await Promise.all(
    data.response.docs.map(({ identifier }) => getItem(identifier as string)),
  );

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {testItems.map((item) => {
          const [thumbnail] = item.files.filter(
            ({ name }) => name === "__ia_thumb.jpg",
          );

          return (
            <Card key={item.metadata.identifier as string}>
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">
                  {item.metadata.title as string}
                </p>
                {/* <small className="text-default-500">12 Tracks</small>
              <h4 className="font-bold text-large">Frontend Radio</h4> */}
              </CardHeader>
              <CardBody className="overflow-visible py-2 h-44">
                {!!thumbnail && (
                  <Image
                    fill
                    priority
                    alt={thumbnail.name as string}
                    className="max-w-64 max-h-40 m-auto"
                    sizes="(max-width: 256px) (max-height: 160px)"
                    src={`https://archive.org/download/${item.metadata.identifier as string}/${thumbnail.name as string}`}
                  />
                )}
              </CardBody>

              {/* <div
              dangerouslySetInnerHTML={{
                __html: item.metadata.description as string,
              }}
            /> */}
            </Card>
          );
        })}
      </div>
      <NextPage />
      {/* <video
        controls
        src={`https://archive.org/download/dragon-ball-z-level-set-collection/${testFile}`}
      /> */}
    </section>
  );
}
