import Link from "next/link";
import { Chip } from "@heroui/chip";

import { fetcher, getItem } from "@/service/api";
import Player from "@/components/player";
import Details from "@/components/details";
import { topicParser } from "@/utils";

const NOT_TOPIC = ["no-preview", "more_animation", "deemphasize", ""];

export default async function MoviePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await fetcher(getItem(slug));
  const { title, description, collection } = item.metadata;

  return (
    <div>
      <Player slug={slug} />
      <h1 className="text-2xl text-primary mb-4">{title as string}</h1>
      <div className="mb-4">
        {(collection as string[])
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
        dangerouslySetInnerHTML={{ __html: description as string }}
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
