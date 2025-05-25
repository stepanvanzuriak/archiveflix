import path from "node:path";

import { GetItemResponse } from "internetarchive-sdk-js";

import { videoExtensions } from "@/constants";

const isVideo = (filePath: string) => {
  return videoExtensions.has(path.extname(filePath).slice(1).toLowerCase());
};

const Player = ({ item, slug }: { item: GetItemResponse; slug: string }) => {
  const videos = item.files.filter(({ name }) => isVideo(name as string));
  const currentVideo = videos[0].name as string;

  return (
    <>
      <div className="mb-10 h-[580px] flex items-center justify-center">
        <iframe
          loading="lazy"
          key={currentVideo}
          src={`https://archive.org/embed/${slug}&playlist=1&list_height=100`}
          width="640"
          height="580"
          frameBorder="0"
          allowFullScreen
          title={currentVideo}
        />
      </div>
    </>
  );
};

export default Player;
