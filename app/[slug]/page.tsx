import Link from "next/link";
import { Chip } from "@heroui/chip";

import { fetcher } from "@/service/api";
import Player from "@/components/video/player";
import Details from "@/components/video/details";
import { cleanHTML, topicParser } from "@/utils";
import VideoActions from "@/components/video/video-actions";
import { NOT_TOPIC } from "@/constants";

const access = process.env.S3!;
const secret = process.env.S3_SECRET!;

export default async function MoviePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await fetcher(`https://archive.org/metadata/${slug}`, {
    Authorization: `LOW ${access}:${secret}`,
  });

  const { title, description, collection, identifier } = item.metadata;
  const collectionList: string[] = Array.isArray(collection)
    ? collection
    : [collection];

  return (
    <div>
      <Player slug={slug} />
      <div className="flex items-center mb-4 gap-4 sm:justify-between">
        <h1 className="text-2xl">{title as string}</h1>
        <VideoActions
          withExpandedVersion
          identifier={identifier}
          redirectOnNotInterested
        />
      </div>
      <div className="mb-4">
        {collectionList
          .filter((topic) => !NOT_TOPIC.includes(topic))
          .map((topic) => (
            <Link
              key={topic}
              href={`/collection/${topic}`}
              className="cursor-pointer"
            >
              <Chip className="mr-2">{topicParser(topic)}</Chip>
            </Link>
          ))}
      </div>

      <div
        className="injected mb-4 text-pretty"
        dangerouslySetInnerHTML={{
          __html: cleanHTML(description),
        }}
      />

      <Details
        identifier={slug}
        metadata={item.metadata}
        reviews={item.reviews}
        files={item.files as Record<string, string>[]}
      />
    </div>
  );
}
