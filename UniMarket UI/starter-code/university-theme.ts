export type SeasonalCampaign = {
  id: string;
  activeFrom: string;
  activeTo: string;
  headline: string;
  body: string;
};

export type UniversityTheme = {
  id: string;
  name: string;
  shortName: string;
  domain: string;
  colors: {
    ink: string;
    canvas: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    ui: string;
    condensed: string;
    editorial: string;
  };
  copy: {
    communityName: string;
    welcome: string;
    verification: string;
    marketplaceTagline: string;
  };
  locations: string[];
  seasonalCampaigns: SeasonalCampaign[];
  legalDisclosure: string;
};

export const waterlooTheme: UniversityTheme = {
  id: "uwaterloo",
  name: "University of Waterloo",
  shortName: "Waterloo",
  domain: "uwaterloo.ca",
  colors: {
    ink: "#080B12",
    canvas: "#F7F5F0",
    primary: "#FFC928",
    secondary: "#DFA600",
    accent: "#FFE889",
  },
  typography: {
    ui: "Geist",
    condensed: "Barlow Condensed",
    editorial: "Georgia",
  },
  copy: {
    communityName: "Waterloo Marketplace",
    welcome: "Welcome, Warrior.",
    verification: "Verified through @uwaterloo.ca",
    marketplaceTagline: "Waterloo buys from Waterloo.",
  },
  locations: [
    "Waterloo Campus", "University Plaza", "ICON", "UWP", "REV",
    "V1", "CMH", "Lester", "Columbia", "Phillip"
  ],
  seasonalCampaigns: [],
  legalDisclosure:
    "UniMarket is an independent student-built platform and is not officially affiliated with the University of Waterloo.",
};
