import { Card, CardBody, CardHeader } from "@heroui/card";
import { GetItemResponse } from "internetarchive-sdk-js";
import Image from "next/image";

const VideosList = ({ movies }: { movies: GetItemResponse[] }) => {
  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {movies.map((item) => {
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
  );
};

export default VideosList;
