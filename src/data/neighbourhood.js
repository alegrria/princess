export const neighbourhood = {
  area: "Hamburg-Horn / Kroogblöcke",
  // Broad Horn area; deliberately no entrance marker.
  mapUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=10.060%2C53.530%2C10.140%2C53.570&layer=mapnik",
  mapLink:
    "https://www.openstreetmap.org/search?query=Kroogbl%C3%B6cke%20Hamburg",
  points: [
    {
      id: "transport",
      group: "transport",
      url: "https://www.hvv.de/",
      source: "hvv",
      checked: "2026-09-15",
    },
    {
      id: "netto",
      group: "daily",
      url: "https://www.openstreetmap.org/search?query=Netto%20Kroogbl%C3%B6cke%20Hamburg",
      source: "OpenStreetMap",
      checked: null,
    },
    {
      id: "cluster",
      group: "daily",
      url: "https://ekzhorn.de/center/",
      source: "EKZ Horner Rennbahn",
      checked: "2026-09-16",
      source: "OpenStreetMap",
      checked: null,
    },
    {
      id: "hauptbahnhof",
      group: "transport",
      url: "https://www.hvv.de/",
      source: "hvv",
      checked: "2026-09-16",
    },
  ],
};
