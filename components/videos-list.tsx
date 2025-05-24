"use client";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { GetItemResponse } from "internetarchive-sdk-js";
import Image from "next/image";

const VideosList = ({ movies }: { movies: GetItemResponse[] }) => {
  const router = useRouter();

  const openPage = (name: string) => {
    router.push(`/${name}`);
  };

  return (
    <div className="gap-2 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:sgrid-cols-2 flex-grow">
      {movies.map((item) => {
        const [thumbnail] = item.files.filter(
          ({ name }) => name === "__ia_thumb.jpg",
        );
        const description = item.metadata.description as string;
        const formatedDescription =
          description && description.replace
            ? description.replace(/(<([^>]+)>)/gi, "").substring(0, 100) +
              (description.length > 100 ? "..." : "")
            : "No description";
        const title = item.metadata.title as string;
        const identifier = item.metadata.identifier as string;

        return (
          <button
            onClick={() => {
              openPage(identifier);
            }}
            key={identifier}
          >
            <Card className="bg-transparent text-primary border-secondary border-2 cursor-pointer">
              <CardHeader className="pb-0 flex-col items-start">
                <h4
                  className="w-full text-medium uppercase font-bold truncate"
                  title={title}
                >
                  {title}
                </h4>

                <small
                  className="text-default-500 w-full truncate"
                  title={formatedDescription}
                >
                  {formatedDescription}
                </small>
              </CardHeader>
              <CardBody className="overflow-visible h-44">
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
            </Card>
          </button>
        );
      })}
    </div>
  );
};

export default VideosList;
