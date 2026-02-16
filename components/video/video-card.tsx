import Image from "next/image";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { HeartIcon, HideIcon, Watched } from "../layout/icons";
import VideoActions from "./video-actions";
import { pickBestThumbnail, ArchiveFile } from "@/utils";

const VideoCard = ({
  movie,
  openPage,
  onNotInterested,
  isWatched,
  isLiked,
  isNotInterested,
}: {
  movie: {
    files: ArchiveFile[];
    metadata: {
      description: string;
      title: string;
      identifier: string;
    };
  };
  isWatched: boolean;
  isLiked: boolean;
  isNotInterested: boolean;
  openPage: (page: string) => void;
  onNotInterested: (id: string) => void;
}) => {
  const thumbnailName = pickBestThumbnail(movie.files);

  const description = movie.metadata.description;
  const formatedDescription =
    description && description.replace
      ? description.replace(/(<([^>]+)>)/gi, "").substring(0, 100) +
        (description.length > 100 ? "..." : "")
      : "No description";
  const title = movie.metadata.title;
  const identifier = movie.metadata.identifier;

  return (
    <Card
      onClick={() => {
        openPage(identifier);
      }}
      className="border-dark dark:border-white border-2"
      isPressable
      shadow="none"
    >
      <CardHeader className="pb-0 flex-col items-start">
        <div className="flex w-full gap-2 items-center">
          {isLiked && <HeartIcon className="size-5 text-red-400" />}
          {isWatched && <Watched className="size-5 text-blue-400" />}
          {isNotInterested && <HideIcon className="size-5 text-yellow-400" />}
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
      <CardBody className="overflow-hidden h-44 relative">
        {!!thumbnailName && (
          <Image
            fill
            priority
            alt={thumbnailName}
            className="object-cover grayscale-50 rounded-large !inset-2 !w-[calc(100%-1rem)] !h-[calc(100%-1rem)]"
            sizes="(max-width: 768px) 100vw, 256px"
            src={`https://archive.org/download/${movie.metadata.identifier}/${thumbnailName}`}
          />
        )}
      </CardBody>
    </Card>
  );
};

export default VideoCard;
