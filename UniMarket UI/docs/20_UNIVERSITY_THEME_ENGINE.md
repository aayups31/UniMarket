# University Theme Engine

## Principle

The backend and product logic remain shared. University identity is data-driven.

Do not hardcode Waterloo colors, strings, and locations across components.

## Suggested model

```ts
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
```

## Waterloo configuration

```ts
{
  id: "uwaterloo",
  name: "University of Waterloo",
  shortName: "Waterloo",
  domain: "uwaterloo.ca",
  colors: {
    ink: "#080B12",
    canvas: "#F7F5F0",
    primary: "#FFC928",
    secondary: "#DFA600",
    accent: "#FFE889"
  },
  typography: {
    ui: "Geist",
    condensed: "Barlow Condensed",
    editorial: "Georgia"
  },
  copy: {
    communityName: "Waterloo Marketplace",
    welcome: "Welcome, Warrior.",
    verification: "Verified through @uwaterloo.ca",
    marketplaceTagline: "Waterloo buys from Waterloo."
  },
  locations: [
    "Waterloo Campus", "University Plaza", "ICON", "UWP", "REV",
    "V1", "CMH", "Lester", "Columbia", "Phillip"
  ]
}
```

A new university should require domain mapping, theme configuration, local areas, campus-aware copy, and launch campaign assets—not a duplicated application.
