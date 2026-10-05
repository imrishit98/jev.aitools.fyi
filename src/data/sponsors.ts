export type Sponsor = {
  name: string;
  url: string;
  tagline: string;
  logoUrl: string;
};

export function sponsorInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const first = trimmed[0];
  return first?.toUpperCase() ?? "?";
}

/** Static homepage and footer sponsors. Edit this list to change placements. */
export const sponsors: Sponsor[] = [
  {
    name: "madbid.lol",
    url: "https://madbid.lol/",
    tagline:
      "The paid leaderboard for AI builders. Products, agents and agencies buy their rank.",
    logoUrl: "https://madbid.lol/favicon.ico",
  },
];
