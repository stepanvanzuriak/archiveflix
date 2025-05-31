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
    default:
      return topic;
  }
};
