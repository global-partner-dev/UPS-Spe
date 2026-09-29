import { SiteHeader } from "./site-header";
export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="bg-navy text-hero-foreground"><SiteHeader dark/><div className="section-shell pb-20 pt-40"><p className="eyebrow">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{title}</h1><p className="mt-6 max-w-2xl text-base leading-7 text-hero-foreground/70 sm:text-lg">{description}</p></div></div>;
}