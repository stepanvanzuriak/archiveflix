import Image from "next/image";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { HeartIcon, Watched } from "../layout/icons";

import VideoActions from "./video-actions";

const VideoCard = ({
  movie,
  openPage,
  onNotInterested,
  isWatched,
  isLiked,
}: {
  movie: {
    files: { name: string }[];
    metadata: {
      description: string;
      title: string;
      identifier: string;
    };
  };
  isWatched: boolean;
  isLiked: boolean;
  openPage: (page: string) => void;
  onNotInterested: (id: string) => void;
}) => {
  const [thumbnail] = movie.files.filter(
    ({ name }) => name === "__ia_thumb.jpg",
  );

  const description = movie.metadata.description;
  const formatedDescription =
    description && description.replace
      ? description.replace(/(<([^>]+)>)/gi, "").substring(0, 100) +
        (description.length > 100 ? "..." : "")
      : "No description";
  const title = movie.metadata.title;
  const identifier = movie.metadata.identifier;

  return (
    <button
      onClick={() => {
        openPage(identifier);
      }}
    >
      <Card className="bg-transparent text-primary border-secondary border-2 cursor-pointer">
        <CardHeader className="pb-0 flex-col items-start">
          <div className="flex w-full gap-2 items-center">
            {isLiked && <HeartIcon className="size-5 text-red-400" />}
            {isWatched && <Watched className="size-5 text-blue-400" />}
            <h4
              className="text-medium uppercase font-bold truncate grow text-left"
              title={title}
            >
              {title}
            </h4>
            <VideoActions
              identifier={identifier}
              onNotInterested={onNotInterested}
            />
          </div>

          <small
            className="text-default-500 w-full truncate text-left"
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
              className="max-w-[220px] max-h-40 m-auto grayscale-50 rounded-large"
              sizes="(max-width: 220px) (max-height: 160px)"
              src={`https://archive.org/download/${movie.metadata.identifier as string}/${thumbnail.name as string}`}
            />
          )}
        </CardBody>
      </Card>
    </button>
  );
};

export default VideoCard;
