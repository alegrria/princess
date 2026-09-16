import { Header } from "../components/Header.js";
import { Design } from "../components/Design.js";
import { Hero } from "../components/Hero.js";
import { ApartmentFacts } from "../components/ApartmentFacts.js";
import { Gallery } from "../components/Gallery.js";
import { Amenities } from "../components/Amenities.js";
import { Pricing } from "../components/Pricing.js";
import { Availability } from "../components/Availability.js";
import { TenantProfile } from "../components/TenantProfile.js";
import { Neighbourhood } from "../components/Neighbourhood.js";
import { Documents } from "../components/Documents.js";
import { FAQ } from "../components/FAQ.js";
import { InquiryForm } from "../components/InquiryForm.js";
import { Footer } from "../components/Footer.js";
import { sectionHeading } from "../components/shared.js";
export function Home(t) {
  return `${Header(t)}<main id="main">${Hero(t)}${ApartmentFacts(t)}${Gallery(t)}${Design(t)}${Amenities(t)}${Pricing(t)}${Availability(t)}${TenantProfile(t)}${Neighbourhood(t)}<section class="section steps">${sectionHeading(t.steps.eyebrow, t.steps.title)}<div>${t.steps.items.map(([title, text], i) => `<article><span>0${i + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></section>${InquiryForm(t)}${Documents(t)}${FAQ(t)}</main>${Footer(t)}`;
}
