import { Chip } from "@heroui/chip";

import FilesList from "@/components/files-list";
import { getItem } from "@/service/api";

const NOT_TOPIC = ["no-preview", "more_animation", "deemphasize"];

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
    case "vj_loops":
      return "VJ Loops";
    case "artsandmusicvideos":
      return "Art & Music";
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
  const item = await getItem(slug);
  const { title, description, collection } = item.metadata;

  const video = item.files.filter(
    ({ format }) =>
      format === "h.264" ||
      format === "MPEG4" ||
      format === "MPEG1" ||
      format === "Ogg Video" ||
      // format === "QuickTime" ||
      format === "MPEG1",
  )[0].name;

  // console.log(item.files);

  return (
    <div>
      <div className="mb-10 h-[500px] flex items-center justify-center">
        {/* eslint-disable-next-line */}
        <video controls preload="auto" className="h-[450px]">
          <source
            src={`https://archive.org/download/${slug}/${video}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

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

      <div className="mb-4">
        <h1 className="text-lg text-primary mb-4">Other list</h1>
        <FilesList
          identifier={slug}
          files={item.files as Record<string, string>[]}
        />
      </div>
    </div>
  );
}
