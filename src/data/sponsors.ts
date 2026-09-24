export type Sponsor = {
  name: string;
  url: string;
  tagline: string;
  logoUrl: string;
};

/** Static homepage and footer sponsors. Edit this list to change placements. */
export const sponsors: Sponsor[] = [
  {
    name: "Trylle",
    url: "https://trylle.com/",
    tagline: "The Git platform where agents ship like engineers.",
    logoUrl: "https://trylle.com/favicon.ico",
  },
  {
    name: "madbid.lol",
    url: "https://madbid.lol/",
    tagline:
      "The paid leaderboard for AI builders. Products, agents and agencies buy their rank.",
    logoUrl: "https://madbid.lol/favicon.ico",
  },
  {
    name: "Feedspace",
    url: "https://feedspace.io/",
    tagline:
      "AI review collection. Gather video, audio and text testimonials and show social proof.",
    logoUrl: "https://feedspace.io/favicon.ico",
  },
];
