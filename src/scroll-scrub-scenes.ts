import { createElement } from "react";
import type { ScrollScrubScene, ScrollScrubTheme } from "@/components/scroll-scrub/scroll-scrub";
export const scrollScrubTheme: ScrollScrubTheme = {
 accent: "#B93440", background: "#151719", ink: "#F2F3F4", muted: "#B8BDC2"
};
const common = {
 id: "top", label: "Tip.Top", clip: "./assets/world/scene-01.mp4",
 mobileClip: "./assets/world/scene-01-mobile.mp4",
 poster: "./assets/world/scene-01-poster.png",
 mobilePoster: "./assets/world/scene-01-mobile-poster.png",
 scroll: 2.2, linger: 0.12, objectPosition: "60% center", mobileObjectPosition: "55% center",
};
export const scrollScrubScenes: ScrollScrubScene[] = [{
 ...common, kicker: "Barbershop in Zwijndrecht",
 title: "Fris geknipt. Tip.Top.",
 body: "Jouw stijl begint in de stoel. Een nieuw websiteconcept voor Tip.TopBarbershop.",
 actions: createElement("a",{href:"#afspraak",className:"hero-ticket"}, "Afspraak bekijken",createElement("span",{"aria-hidden":true},"↗"))
}];
export const englishScenes: ScrollScrubScene[] = [{
 ...common, kicker: "Barbershop in Zwijndrecht",
 title: "Fresh cut. Tip.Top.",
 body: "Your style starts in the chair. A new website concept for Tip.TopBarbershop.",
 actions: createElement("a",{href:"#afspraak",className:"hero-ticket"}, "Try the demo",createElement("span",{"aria-hidden":true},"↗"))
}];
