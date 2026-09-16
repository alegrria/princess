import { getLocale } from "./lib/locale.js";
const de = getLocale("de"),
  en = getLocale("en");
import { apartment } from "./data/apartment.js";
import { gallery } from "./data/gallery.js";
import { neighbourhood } from "./data/neighbourhood.js";
import {
  isoDate,
  addMonths,
  validDate,
  validatePeriod,
} from "./data/availability.js";
import { Home } from "./pages/Home.js";
import { Legal } from "./pages/Legal.js";
import { calendarMarkup } from "./components/Availability.js";
import { picture, template, displayDate } from "./lib/html.js";
import { availabilityText } from "./components/shared.js";
import { validateInquiry, enquiryText } from "./lib/inquiry.js";

const root = document.getElementById("app");
let storedLanguage;
try {
  storedLanguage = localStorage.getItem("princess-language");
} catch {}
const requestedLanguage = new URLSearchParams(location.search).get("lang");
const state = {
  lang: ["de", "en"].includes(requestedLanguage)
    ? requestedLanguage
    : storedLanguage === "en"
      ? "en"
      : "de",
  month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  start: "",
  end: "",
  draft: {},
  photo: 0,
  filter: "all",
  mapLoaded: false,
  formOpened: Date.now(),
  lastSubmission: 0,
};
let galleryTrigger = null,
  swipeStart = null,
  toastTimer;
const t = () => (state.lang === "en" ? en : de);
const activePage = () =>
  ["impressum", "datenschutz"].includes(location.hash.slice(1))
    ? location.hash.slice(1)
    : ["impressum", "datenschutz"].includes(location.pathname.split("/")[1]) &&
        !location.hash
      ? location.pathname.split("/")[1]
      : "home";
function saveDraft() {
  const form = document.getElementById("inquiry-form");
  if (form) state.draft = Object.fromEntries(new FormData(form));
}
function restoreDraft() {
  const form = document.getElementById("inquiry-form");
  if (!form) return;
  for (const [name, value] of Object.entries(state.draft)) {
    const field = form.elements.namedItem(name);
    if (!field) continue;
    if (field.type === "checkbox") field.checked = Boolean(value);
    else field.value = value;
  }
}
function updateMetadata() {
  const text = t(),
    page = activePage();
  document.documentElement.lang = state.lang;
  document.title =
    page === "home"
      ? text.title
      : `${page === "impressum" ? text.footer.legal : text.footer.privacy} | The Princess`;
  document.querySelector('meta[name="description"]').content = text.description;
  for (const key of ["og:title", "twitter:title"])
    document.querySelector(
      `meta[${key.startsWith("og") ? "property" : "name"}="${key}"]`,
    ).content = document.title;
  for (const key of ["og:description", "twitter:description"])
    document.querySelector(
      `meta[${key.startsWith("og") ? "property" : "name"}="${key}"]`,
    ).content = text.description;
  document.querySelector('meta[property="og:locale"]').content =
    state.lang === "de" ? "de_DE" : "en_GB";
  const url = `${apartment.site.origin}${page === "home" ? "/" : `/${page}/`}${state.lang === "en" ? "?lang=en" : ""}`;
  document.querySelector('link[rel="canonical"]').href = url;
  document.querySelector('meta[property="og:url"]').content = url;
}
let stickyObserver;
function watchInquiryButton() {
  stickyObserver?.disconnect();
  const sticky = document.querySelector(".mobile-sticky");
  const hero = document.querySelector(".hero-buttons");
  const inquiry = document.getElementById("inquiry");
  if (!sticky || !hero || !inquiry) return;
  const update = () => {
    const heroBox = hero.getBoundingClientRect();
    const formBox = inquiry.getBoundingClientRect();
    sticky.hidden =
      heroBox.bottom > 0 || (formBox.top < innerHeight && formBox.bottom > 0);
  };
  stickyObserver = new IntersectionObserver(update, { threshold: [0, 1] });
  stickyObserver.observe(hero);
  stickyObserver.observe(inquiry);
  update();
}
function render() {
  saveDraft();
  root.innerHTML =
    activePage() === "home" ? Home(t()) : Legal(t(), activePage());
  restoreDraft();
  state.mapLoaded = false;
  updateMetadata();
  renderCalendar();
  const form = document.getElementById("inquiry-form");
  if (form) form.addEventListener("submit", submitInquiry);
  applyGalleryFilter();
  watchInquiryButton();
}
function renderCalendar() {
  const calendar = document.getElementById("calendar");
  if (!calendar) return;
  calendar.innerHTML = calendarMarkup(t(), state.month, state);
  document.getElementById("availability-start").value = state.start;
  document.getElementById("availability-end").value = state.end;
  document.getElementById("availability-end").min = state.start
    ? addMonths(state.start, apartment.rental.minimumMonths)
    : isoDate();
  document.getElementById("calendar-status").textContent = state.start
    ? state.end
      ? `${displayDate(state.start, state.lang)} – ${displayDate(state.end, state.lang)}`
      : displayDate(state.start, state.lang)
    : t().availability.empty;
}
function showDateError(key) {
  document.getElementById("calendar-status").textContent = template(
    t().inquiry[key],
    { minimum: apartment.rental.minimumMonths },
  );
}
function stageDates(start, end) {
  const error = validatePeriod(start, end);
  if (error) {
    showDateError(error);
    return false;
  }
  state.start = start;
  state.end = end;
  state.draft = { ...state.draft, start, end };
  const form = document.getElementById("inquiry-form");
  form.elements.start.value = start;
  form.elements.end.value = end;
  form.elements.end.min = addMonths(start, apartment.rental.minimumMonths);
  renderCalendar();
  document.getElementById("inquiry").scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
  form.elements.name.focus({ preventScroll: true });
  return true;
}
function applyGalleryFilter() {
  root
    .querySelectorAll("[data-category]")
    .forEach(
      (el) =>
        (el.hidden =
          state.filter !== "all" && el.dataset.category !== state.filter),
    );
  root
    .querySelectorAll("[data-filter]")
    .forEach((el) =>
      el.setAttribute(
        "aria-pressed",
        String(el.dataset.filter === state.filter),
      ),
    );
}
function renderPhoto() {
  const photo = gallery[state.photo],
    text = t();
  document.querySelector(".lightbox-image").innerHTML = picture(photo, {
    hero: true,
    alt: text.gallery.alts[photo.id],
  });
  document.getElementById("lightbox-caption").textContent =
    `${state.photo + 1} / ${gallery.length} · ${text.gallery[photo.kind]} — ${text.gallery.captions[photo.id]}`;
}
function openPhoto(index, trigger) {
  state.photo = index;
  galleryTrigger = trigger;
  renderPhoto();
  document.getElementById("lightbox").showModal();
}
function closePhoto() {
  document.getElementById("lightbox").close();
  galleryTrigger?.focus();
}
function nextPhoto(direction) {
  state.photo = (state.photo + direction + gallery.length) % gallery.length;
  renderPhoto();
}
function toast(message) {
  clearTimeout(toastTimer);
  const node = document.getElementById("share-status");
  node.textContent = message;
  toastTimer = setTimeout(() => {
    if (node.isConnected) node.textContent = "";
  }, 4500);
}
async function share() {
  const url = `${apartment.site.origin}/${state.lang === "en" ? "?lang=en" : ""}`;
  try {
    await navigator.clipboard.writeText(url);
    toast(t().copied);
  } catch {
    toast(t().copyFailed);
  }
}
function setMap() {
  const node = document.getElementById("map-surface"),
    button = document.getElementById("load-map");
  if (!state.mapLoaded) {
    const frame = document.createElement("iframe");
    frame.title = t().neighbourhood.frame;
    frame.src = neighbourhood.mapUrl;
    frame.referrerPolicy = "no-referrer";
    frame.loading = "lazy";
    node.replaceChildren(frame);
    state.mapLoaded = true;
    button.textContent = t().neighbourhood.unload;
  } else {
    node.innerHTML = `<span class="map-symbol" aria-hidden="true">↗</span><h3>${t().neighbourhood.mapTitle}</h3><p>${t().neighbourhood.mapText}</p>`;
    state.mapLoaded = false;
    button.textContent = t().neighbourhood.load;
  }
  button.setAttribute("aria-pressed", String(state.mapLoaded));
}
function formError(key) {
  const node = document.getElementById("form-error");
  node.hidden = false;
  node.textContent = template(t().inquiry[key], {
    minimum: apartment.rental.minimumMonths,
  });
  node.focus();
}
async function submitInquiry(event) {
  event.preventDefault();
  const form = event.target,
    data = Object.fromEntries(new FormData(form)),
    f = t().inquiry,
    c = apartment.contact;
  document.getElementById("form-error").hidden = true;
  document.getElementById("form-status").textContent = "";
  const error = validateInquiry(data);
  if (error) return formError(error);
  if (Date.now() - state.formOpened < c.minFormSeconds * 1000)
    return formError("wait");
  if (
    state.lastSubmission &&
    Date.now() - state.lastSubmission < c.cooldownSeconds * 1000
  )
    return formError("cooldown");
  const button = form.querySelector("[type=submit]"),
    original = button.innerHTML;
  button.disabled = true;
  try {
    if (c.endpoint) {
      button.textContent = f.sending;
      const result = await fetch(c.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, language: state.lang }),
        signal: AbortSignal.timeout(15000),
      });
      if (!result.ok) throw new Error("Request failed");
      const body = await result.json();
      if (body.accepted !== true) throw new Error("Not accepted");
      document.getElementById("form-status").textContent = f.success;
    } else if (c.email) {
      const body = enquiryText(data, t()).replace(`${f.draftLabel}\n`, "");
      location.href = `mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(body)}`;
      document.getElementById("form-status").textContent = f.emailSuccess;
    } else {
      const blob = new Blob([enquiryText(data, t())], {
          type: "text/plain;charset=utf-8",
        }),
        url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = "princess-anfrage-entwurf.txt";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      document.getElementById("form-status").textContent = f.draftSuccess;
    }
    state.lastSubmission = Date.now();
    state.draft = data;
  } catch {
    formError("failure");
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
}
root.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) {
    if (button.dataset.lang) {
      saveDraft();
      state.lang = button.dataset.lang;
      try {
        localStorage.setItem("princess-language", state.lang);
      } catch {}
      const url = new URL(location.href);
      url.searchParams.set("lang", state.lang);
      history.replaceState(null, "", url);
      render();
      root.querySelector(`[data-lang="${state.lang}"]`).focus();
    } else if (button.id === "menu-button") {
      const menu = document.getElementById("mobile-menu");
      menu.hidden = !menu.hidden;
      button.setAttribute("aria-expanded", String(!menu.hidden));
    } else if (button.dataset.photo !== undefined)
      openPhoto(Number(button.dataset.photo), button);
    else if (button.classList.contains("dialog-close")) closePhoto();
    else if (button.dataset.direction)
      nextPhoto(Number(button.dataset.direction));
    else if (button.dataset.filter) {
      state.filter = button.dataset.filter;
      applyGalleryFilter();
    } else if (button.dataset.month) {
      state.month = new Date(
        state.month.getFullYear(),
        state.month.getMonth() + Number(button.dataset.month),
        1,
      );
      renderCalendar();
    } else if (button.dataset.date) {
      if (!state.start || state.end || button.dataset.date <= state.start) {
        state.start = button.dataset.date;
        state.end = "";
      } else state.end = button.dataset.date;
      renderCalendar();
    } else if (button.id === "clear-dates") {
      state.start = "";
      state.end = "";
      renderCalendar();
    } else if (button.id === "ask-dates")
      stageDates(
        document.getElementById("availability-start").value,
        document.getElementById("availability-end").value,
      );
    else if (button.id === "load-map") setMap();
    else if (button.classList.contains("share-button")) share();
    else if (button.id === "print-button") window.print();
  }
  const link = event.target.closest('a[href^="#"]');
  if (link) {
    document.getElementById("mobile-menu").hidden = true;
    document
      .getElementById("menu-button")
      .setAttribute("aria-expanded", "false");
    if (
      activePage() !== "home" &&
      !["#impressum", "#datenschutz"].includes(link.hash)
    ) {
      event.preventDefault();
      history.pushState(null, "", `/${location.search}${link.hash || "#"}`);
      render();
      document.getElementById(link.hash.slice(1) || "main")?.scrollIntoView();
    }
  }
});
root.addEventListener("change", (event) => {
  if (
    event.target.id === "availability-start" ||
    event.target.id === "availability-end"
  ) {
    state.start = document.getElementById("availability-start").value;
    state.end = document.getElementById("availability-end").value;
    renderCalendar();
  }
  if (event.target.name === "start" && validDate(event.target.value)) {
    event.target.form.elements.end.min = addMonths(
      event.target.value,
      apartment.rental.minimumMonths,
    );
  }
});
root.addEventListener("keydown", (event) => {
  const box = document.getElementById("lightbox");
  if (box?.open && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    nextPhoto(event.key === "ArrowLeft" ? -1 : 1);
  }
  if (event.key === "Escape") {
    const menu = document.getElementById("mobile-menu");
    if (menu && !menu.hidden) {
      menu.hidden = true;
      document
        .getElementById("menu-button")
        .setAttribute("aria-expanded", "false");
      document.getElementById("menu-button").focus();
    }
  }
});
root.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".lightbox-image"))
    swipeStart = { x: event.clientX, y: event.clientY };
});
root.addEventListener("pointerup", (event) => {
  if (swipeStart && event.target.closest(".lightbox-image")) {
    const dx = event.clientX - swipeStart.x,
      dy = event.clientY - swipeStart.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
      nextPhoto(dx < 0 ? 1 : -1);
  }
  swipeStart = null;
});
root.addEventListener("pointercancel", () => {
  swipeStart = null;
});
let previousPage = activePage();
window.addEventListener("hashchange", () => {
  const page = activePage();
  if (page !== previousPage) {
    render();
    window.scrollTo(0, 0);
  }
  previousPage = page;
});
window.addEventListener("popstate", () => {
  render();
  previousPage = activePage();
});
render();
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
  for (const tool of [
    {
      name: "read_apartment_availability",
      description:
        "Read apartment facts and configured availability. Unknown dates are not confirmed bookings.",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute(input) {
        if (!input || typeof input !== "object" || Object.keys(input).length)
          throw new Error("Expected an empty object");
        return {
          name: apartment.name,
          size: apartment.size,
          status: apartment.availability.status,
          availableFrom: apartment.availability.availableFrom,
          periods: apartment.availability.periods,
          minimumMonths: apartment.rental.minimumMonths,
          monthlyRent: apartment.pricing.monthly,
        };
      },
    },
    {
      name: "stage_inquiry_dates",
      description:
        "Fill the visible enquiry form with a move-in and move-out date. Does not send an enquiry or reserve dates.",
      inputSchema: {
        type: "object",
        properties: {
          moveIn: { type: "string", format: "date" },
          moveOut: { type: "string", format: "date" },
        },
        required: ["moveIn", "moveOut"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute(input) {
        if (
          !input ||
          typeof input !== "object" ||
          Object.keys(input).some((k) => !["moveIn", "moveOut"].includes(k))
        )
          throw new Error("Invalid input");
        const error = validatePeriod(input.moveIn, input.moveOut);
        if (error) throw new Error(error);
        if (activePage() !== "home") {
          history.pushState(null, "", `/${location.search}#inquiry`);
          render();
        }
        stageDates(input.moveIn, input.moveOut);
        return {
          status: "draft_staged",
          moveIn: state.start,
          moveOut: state.end,
          sent: false,
        };
      },
    },
  ]) {
    try {
      Promise.resolve(
        document.modelContext.registerTool(tool, { signal: lifecycle.signal }),
      ).catch(() => {});
    } catch {}
  }
}
