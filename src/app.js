const photos = [
  {
    src: "https://images.pexels.com/photos/7168071/pexels-photo-7168071.jpeg?auto=compress&w=1800",
    caption: "01 / Living room",
    alt: "Bright living room with white sofas and timber floors",
  },
  {
    src: "https://images.pexels.com/photos/6903156/pexels-photo-6903156.jpeg?auto=compress&w=1400",
    caption: "02 / Bedroom",
    alt: "Contemporary bedroom with soft grey bedding",
  },
  {
    src: "https://images.pexels.com/photos/6996072/pexels-photo-6996072.jpeg?auto=compress&w=1400",
    caption: "03 / Kitchen",
    alt: "Bright white kitchen with a dining space",
  },
];
["hero-photo", "bed-photo", "kitchen-photo"].forEach(
  (id, i) => (document.getElementById(id).src = photos[i].src),
);
const gallery = document.getElementById("gallery"),
  enquiry = document.getElementById("enquiry");
let current = 0;
function renderPhoto() {
  const p = photos[current];
  const img = document.getElementById("gallery-image");
  img.src = p.src;
  img.alt = p.alt;
  document.getElementById("gallery-caption").textContent = p.caption;
}
function openGallery(index = 0) {
  current = index;
  renderPhoto();
  gallery.showModal();
}
document.getElementById("open-gallery").onclick = () => openGallery();
document
  .querySelectorAll("[data-photo]")
  .forEach((b) => (b.onclick = () => openGallery(Number(b.dataset.photo))));
document.getElementById("previous").onclick = () => {
  current = (current + 2) % 3;
  renderPhoto();
};
document.getElementById("next").onclick = () => {
  current = (current + 1) % 3;
  renderPhoto();
};
gallery.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    document.getElementById("previous").click();
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    document.getElementById("next").click();
  }
});
document
  .querySelectorAll("[data-enquire]")
  .forEach((b) => (b.onclick = () => enquiry.showModal()));
document.querySelectorAll("dialog").forEach((d) => {
  d.querySelector(".close").onclick = () => d.close();
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        d.close();
    }
  });
});
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
document.querySelector("[name=date]").min = today.toISOString().slice(0, 10);
if (document.modelContext?.registerTool) {
  try {
    Promise.resolve(
      document.modelContext.registerTool({
        name: "start_viewing_enquiry",
        description:
          "Open the viewing enquiry form. Does not send or download an enquiry.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false },
        execute(input) {
          if (
            !input ||
            typeof input !== "object" ||
            Array.isArray(input) ||
            Object.keys(input).length
          )
            throw new Error("Expected an empty object");
          if (gallery.open) gallery.close();
          if (!enquiry.open) enquiry.showModal();
          return { status: "form_open", delivery: "download_only" };
        },
      }),
    ).catch(() => {});
  } catch {}
}
document.getElementById("enquiry-form").onsubmit = (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const content = `Viewing enquiry — The Linden Flat\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPreferred viewing date: ${data.get("date")}\n\n${data.get("message")}\n\nDraft enquiry only. This has not been sent to an owner.`;
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "linden-viewing-enquiry.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.getElementById("form-status").textContent =
    "Your enquiry file is ready. Share it with the property owner to request a viewing.";
};
