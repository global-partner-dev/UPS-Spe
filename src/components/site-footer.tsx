import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import logoAsset from "@/assets/ups-spe-logo.png.asset.json";
import policyAsset from "@/assets/ups-spe-terms.pdf.asset.json";

export function SiteFooter() {
  return <footer className="bg-navy text-hero-foreground">
    <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><img src={logoAsset.url} alt="UPS Spe" width="430" height="107" className="h-10 w-auto"/><p className="mt-5 max-w-sm text-sm leading-6 text-hero-foreground/65">Reliable UPS installation, maintenance, battery services, and power protection guidance for critical operations.</p></div>
      <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-electric">Explore</p><div className="grid gap-3 text-sm"><Link to="/services">Services</Link><Link to="/projects">Projects</Link><Link to="/about">About UPS Spe</Link><Link to="/contact">Contact</Link></div></div>
      <div><p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-electric">Legal</p><div className="grid gap-3 text-sm"><Link to="/terms">Terms of service</Link><Link to="/privacy">Privacy policy</Link><a href={policyAsset.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">Download policy <ArrowUpRight className="size-3"/></a></div></div>
    </div><div className="border-t border-hero-foreground/10"><div className="section-shell flex flex-col gap-2 py-5 text-xs text-hero-foreground/50 sm:flex-row sm:justify-between"><span>© 2026 UPS Spe. All rights reserved.</span><span>Power continuity, professionally handled.</span></div></div>
  </footer>;
}