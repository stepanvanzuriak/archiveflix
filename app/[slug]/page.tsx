import { Chip } from "@heroui/chip";

import { fetcher, getItem } from "@/service/api";
import Player from "@/components/player";
import Details from "@/components/details";

const NOT_TOPIC = ["no-preview", "more_animation", "deemphasize", ""];

const topicParser = (topic: string) => {
  switch (topic) {
    case "Film_Noir":
      return "Noir";
    case "feature_films":
      return "Feature Film";
    case "moviesandfilms":
      return "Movie";
    case "animationandcartoons":
      return "Animation";
    case "siggraph":
      return "SIGGRAPH";
    case "vintage_cartoons":
      return "Vintage Cartoons";
    case "classic_cartoons":
      return "Classic Cartoons";
    case "machinima":
      return "Machinima";

    // OTHER TYPES
    case "xfrcollective":
      return "XFR Collective";
    case "vj_loops":
      return "VJ Loops";
    case "artsandmusicvideos":
      return "Art & Music";
    case "stream_only":
      return "Stream Only";
    default:
      return topic;
  }
};

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
      <Player item={item} slug={slug} />
      <h1 className="text-2xl text-primary mb-4">{title as string}</h1>
      <div className="mb-4">
        {(collection as string[])
          .filter((topic) => !NOT_TOPIC.includes(topic))
          .map((topic) => (
            <Chip key={topic} className="mr-2">
              {topicParser(topic)}
            </Chip>
          ))}
      </div>

      <div
        className="injected mb-4 text-pretty"
        dangerouslySetInnerHTML={{ __html: description as string }}
      />
      <Details
        identifier={slug}
        metadata={item.metadata}
        files={item.files as Record<string, string>[]}
      />
    </div>
  );
}
