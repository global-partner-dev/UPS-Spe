import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BatteryCharging, Gauge, Settings, ShieldCheck, Wrench, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { loadPublicContent } from "@/lib/public-content";
import heroImage from "@/assets/ups-hero.jpg";
import engineerImage from "@/assets/ups-engineer.jpg";

export const Route = createFileRoute("/")({
  loader: () => loadPublicContent(),
  head: () => ({ meta: [{ title: "UPS Spe | Uninterruptible Power & UPS Services" }, { name: "description", content: "UPS installation, preventive maintenance, battery services, repair, and power protection consulting for critical operations." }, { property: "og:title", content: "UPS Spe | Reliable Power. Uninterrupted Operations." }, { property: "og:description", content: "Professional UPS services and power protection solutions for business-critical environments." }, { property: "og:type", content: "website" }, { property: "og:url", content: "/" }, { name: "twitter:card", content: "summary_large_image" }], links: [{ rel: "canonical", href: "/" }] }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  const { services, projects } = Route.useLoaderData();
  return <main>
    <section className="relative min-h-[92vh] overflow-hidden bg-navy text-hero-foreground">
      <img src={heroImage} alt="Modern UPS systems protecting critical electrical infrastructure" width="1920" height="1080" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high"/>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--navy)_0%,color-mix(in_oklab,var(--navy)_90%,transparent)_43%,color-mix(in_oklab,var(--navy)_15%,transparent)_100%)]"/>
      <SiteHeader dark/>
      <div className="section-shell relative flex min-h-[92vh] items-end pb-20 pt-36 sm:items-center sm:pb-0">
        <div className="max-w-3xl"><p className="eyebrow">UPS & power protection</p><h1 className="mt-5 text-5xl font-semibold leading-[1.04] sm:text-6xl lg:text-7xl">Reliable power.<br/><span className="text-electric">Uninterrupted operations.</span></h1><p className="mt-7 max-w-2xl text-base leading-7 text-hero-foreground/75 sm:text-lg">Professional UPS installation, maintenance, repair, and power protection guidance for businesses where continuity matters.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button asChild variant="hero" size="xl"><Link to="/contact">Request a consultation <ArrowRight/></Link></Button><Button asChild variant="heroOutline" size="xl"><Link to="/services">Explore services</Link></Button></div></div>
      </div>
    </section>
    <section className="border-b border-border bg-background"><div className="section-shell grid divide-y divide-border py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0"><Stat value="6" label="Core service areas"/><Stat value="End-to-end" label="From assessment to upkeep"/><Stat value="Direct" label="Technical consultation"/></div></section>
    <section className="py-24"><div className="section-shell"><div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="eyebrow">What we do</p><h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Power protection across the full lifecycle.</h2><p className="mt-5 max-w-md leading-7 text-muted-foreground">Practical technical support for planning, installing, maintaining, and restoring UPS systems.</p></div><div className="grid border-t border-border sm:grid-cols-2">{services.map((service, index) => <ServiceCard key={service.id} service={service} index={index}/>)}</div></div></div></section>
    <section className="bg-navy py-24 text-hero-foreground"><div className="section-shell grid items-center gap-12 lg:grid-cols-2"><div className="relative"><img src={engineerImage} alt="Engineer inspecting UPS equipment" loading="lazy" width="1400" height="1000" className="aspect-[4/3] w-full object-cover"/><div className="absolute bottom-0 right-0 bg-primary px-6 py-5"><p className="text-xs font-bold uppercase tracking-[0.12em]">Built around your site</p></div></div><div><p className="eyebrow">A controlled process</p><h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Clear decisions before work begins.</h2><p className="mt-6 leading-7 text-hero-foreground/70">Every engagement starts with the operating context: critical loads, existing equipment, runtime expectations, and known risks. Recommendations stay tied to practical requirements.</p><ol className="mt-8 border-t border-hero-foreground/15">{["Review the requirement","Define the right scope","Execute and verify","Document the next steps"].map((step, i) => <li key={step} className="flex gap-5 border-b border-hero-foreground/15 py-4"><span className="font-mono text-sm text-electric">0{i+1}</span><span className="font-semibold">{step}</span></li>)}</ol></div></div></section>
    <section className="py-24"><div className="section-shell"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Selected work</p><h2 className="mt-4 text-4xl font-semibold sm:text-5xl">Resilience in practice.</h2></div><Button asChild variant="outline"><Link to="/projects">View all projects <ArrowRight/></Link></Button></div><div className="mt-12 grid gap-px bg-border lg:grid-cols-3">{projects.slice(0,3).map((project, i) => <article key={project.id} className="bg-background p-7"><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{project.category}</p><h3 className="mt-8 text-2xl font-semibold">{project.title}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{project.summary}</p><div className="mt-8 flex items-center gap-2 text-sm font-semibold text-foreground"><span className="font-mono text-primary">0{i+1}</span><span className="h-px flex-1 bg-border"/><Gauge className="size-4"/></div></article>)}</div></div></section>
    <section className="bg-primary py-20 text-primary-foreground"><div className="section-shell flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground/70">Start with the right questions</p><h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">Tell us what needs to stay powered.</h2></div><Button asChild variant="navy" size="xl"><Link to="/contact">Discuss your requirement <ArrowRight/></Link></Button></div></section>
    <SiteFooter/>
  </main>;
}

const icons: Record<string, LucideIcon> = { zap: Zap, wrench: Wrench, battery: BatteryCharging, shield: ShieldCheck, activity: Gauge, settings: Settings };
function ServiceCard({ service, index }: { service: { icon: string; title: string; summary: string }; index: number }) { const Icon = icons[service.icon] ?? Zap; return <article className="border-b border-border p-7 sm:odd:border-r"><div className="flex items-center justify-between"><Icon className="size-6 text-primary"/><span className="font-mono text-xs text-muted-foreground">0{index+1}</span></div><h3 className="mt-12 text-xl font-semibold">{service.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{service.summary}</p></article>; }
function Stat({ value, label }: { value: string; label: string }) { return <div className="px-6 py-5 first:pl-0"><p className="font-display text-xl font-semibold text-foreground">{value}</p><p className="mt-1 text-xs uppercase tracking-[0.1em] text-muted-foreground">{label}</p></div>; }
