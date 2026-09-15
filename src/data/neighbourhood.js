export const neighbourhood = {
  area: "Hamburg-Billstedt / Kroogblöcke",
  // Broad Billstedt/Horn area; deliberately no entrance marker.
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
      id: "shopping",
      group: "daily",
      url: "https://www.billstedt-center.de/en/service/",
      source: "Billstedt Center",
      checked: "2026-09-15",
    },
    {
      id: "park",
      group: "outdoors",
      url: "https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea/themen/hamburgs-gruen/parkanlagen/oejendorferpark5-274604",
      source: "hamburg.de",
      checked: "2026-09-15",
    },
    {
      id: "essentials",
      group: "daily",
      url: "https://www.openstreetmap.org/search?query=Billstedt%20Hamburg",
      source: "OpenStreetMap",
      checked: null,
    },
  ],
};
