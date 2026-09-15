import { neighbourhood } from "../data/neighbourhood.js";
export function Map(t) {
  return `<div class="map-shell"><div id="map-surface" class="map-surface"><span class="map-symbol" aria-hidden="true">↗</span><p class="eyebrow">HAMBURG · 53° N</p><h3>${t.neighbourhood.mapTitle}</h3><p>${t.neighbourhood.mapText}</p></div><div class="map-consent"><p class="small-copy">${t.neighbourhood.consent}</p><button id="load-map" class="button button-outline" aria-pressed="false">${t.neighbourhood.load}</button><a href="${neighbourhood.mapLink}" target="_blank" rel="noopener noreferrer">${t.neighbourhood.external} ↗</a></div></div>`;
}
