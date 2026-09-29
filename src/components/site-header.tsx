import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/ups-spe-logo.png.asset.json";

const links = [{ to: "/services", label: "Services" }, { to: "/projects", label: "Projects" }, { to: "/about", label: "About" } ] as const;

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return <header className={dark ? "absolute inset-x-0 top-0 z-40 border-b border-hero-foreground/15" : "border-b border-border bg-background"}>
    <div className="section-shell flex h-20 items-center justify-between">
      <Link to="/" aria-label="UPS Spe home"><img src={logoAsset.url} alt="UPS Spe" className="h-10 w-auto" width="430" height="107" /></Link>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
        {links.map((item) => <Link key={item.to} to={item.to} className={dark ? "text-sm font-semibold text-hero-foreground/80 hover:text-hero-foreground" : "text-sm font-semibold text-foreground/75 hover:text-primary"}>{item.label}</Link>)}
        <Button asChild size="lg"><Link to="/contact">Request a quote</Link></Button>
      </nav>
      <Button variant={dark ? "heroOutline" : "ghost"} size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <nav className="section-shell border-t border-border/30 py-4 md:hidden" aria-label="Mobile navigation">{links.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className={dark ? "block py-3 font-semibold text-hero-foreground" : "block py-3 font-semibold"}>{item.label}</Link>)}<Button asChild className="mt-2 w-full"><Link to="/contact">Request a quote</Link></Button></nav>}
  </header>;
}