export const topicParser = (topic: string) => {
  switch (topic) {
    case "Film_Noir":
      return "Noir";
    case "SciFi_Horror":
      return "SciFi Horror";
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
    case "silent_films":
      return "Silent Films";

    // OTHER TYPES
    case "xfrcollective":
      return "XFR Collective";
    case "vj_loops":
      return "VJ Loops";
    case "artsandmusicvideos":
      return "Art & Music";
    case "stream_only":
      return "Stream Only";
    case "prelinger":
      return "Prelinger";
    default:
      return topic;
  }
};

export const processArrayOrString = <T>(
  value: T[] | T | undefined,
  processor: (item: T) => void,
): void => {
  if (!value) return;

  if (Array.isArray(value)) {
    value.forEach(processor);
  } else {
    processor(value);
  }
};

export const cleanHTML = (html: string) =>
  html.replace(/style="[^"]*"/g, "").replace(/color="[^"]*"/g, "");

export interface ArchiveFile {
  name: string;
  format?: string;
  source?: string;
  size?: string;
}

export const pickBestThumbnail = (files: ArchiveFile[]): string | null => {
  // 1. _itemimage.jpg — high-res item image
  const itemImage = files.find(({ name }) => name === "_itemimage.jpg");
  if (itemImage) return itemImage.name;

  // 2. Original JPEGs — largest by size
  const originalJpegs = files.filter(
    ({ format, source, name }) =>
      format === "JPEG" &&
      source === "original" &&
      name !== "__ia_thumb.jpg" &&
      !name.includes("/"),
  );
  if (originalJpegs.length > 0) {
    originalJpegs.sort(
      (a, b) => Number(b.size || 0) - Number(a.size || 0),
    );
    return originalJpegs[0].name;
  }

  // 3. Any JPEG derivative — largest by size, excluding thumb
  const anyJpegs = files.filter(
    ({ format, name }) =>
      format === "JPEG" &&
      name !== "__ia_thumb.jpg" &&
      !name.includes("/"),
  );
  if (anyJpegs.length > 0) {
    anyJpegs.sort(
      (a, b) => Number(b.size || 0) - Number(a.size || 0),
    );
    return anyJpegs[0].name;
  }

  // 4. Fallback to __ia_thumb.jpg
  const thumb = files.find(({ name }) => name === "__ia_thumb.jpg");
  return thumb ? thumb.name : null;
};
