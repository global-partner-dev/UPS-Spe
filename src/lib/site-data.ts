export type ServiceIcon = "zap" | "wrench" | "battery" | "shield" | "activity" | "settings";

export type PublicService = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  details: string;
  icon: ServiceIcon;
  display_order: number;
};

export type PublicProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  location: string;
  result: string;
  image_url: string;
  featured: boolean;
};

export type SiteSettings = {
  company_name: string;
  email: string;
  phone: string;
  location: string;
  availability: string;
};

export type PublicContent = {
  services: PublicService[];
  projects: PublicProject[];
  settings: SiteSettings | null;
};

/** Edit services, projects, and contact details here (static frontend content). */
const settings: SiteSettings = {
  company_name: "UPS Spe",
  email: "",
  phone: "",
  location: "",
  availability: "Available for planned projects and urgent support.",
};

const services: PublicService[] = [
  {
    id: "svc-ups-installation",
    slug: "ups-installation",
    title: "UPS Installation",
    summary: "Right-sized installation and commissioning for reliable power from day one.",
    details:
      "Site review, load assessment, equipment positioning, electrical integration, configuration, testing, and handover.",
    icon: "zap",
    display_order: 1,
  },
  {
    id: "svc-preventive-maintenance",
    slug: "preventive-maintenance",
    title: "Preventive Maintenance",
    summary: "Planned inspections that identify battery, cooling, and component risks before downtime.",
    details:
      "Routine inspection, cleaning, health checks, alarm review, performance testing, and clear maintenance reporting.",
    icon: "activity",
    display_order: 2,
  },
  {
    id: "svc-repair-troubleshooting",
    slug: "repair-troubleshooting",
    title: "Repair & Troubleshooting",
    summary: "Structured fault diagnosis and practical repair support for UPS equipment.",
    details:
      "Fault isolation, alarm investigation, component assessment, corrective recommendations, and return-to-service testing.",
    icon: "wrench",
    display_order: 3,
  },
  {
    id: "svc-battery-services",
    slug: "battery-services",
    title: "Battery Services",
    summary: "Battery health assessment and replacement planning for dependable runtime.",
    details:
      "Condition checks, safe replacement, connection inspection, runtime considerations, and responsible handling guidance.",
    icon: "battery",
    display_order: 4,
  },
  {
    id: "svc-power-consulting",
    slug: "power-consulting",
    title: "Power Protection Consulting",
    summary: "Clear recommendations for capacity, redundancy, resilience, and future growth.",
    details:
      "Requirements discovery, load and risk review, topology guidance, lifecycle planning, and solution recommendations.",
    icon: "shield",
    display_order: 5,
  },
  {
    id: "svc-configuration-testing",
    slug: "configuration-testing",
    title: "Configuration & Testing",
    summary: "Controlled setup and verification to ensure the system behaves as intended.",
    details:
      "Operating parameter review, bypass checks, alarm validation, functional testing, and documented handover.",
    icon: "settings",
    display_order: 6,
  },
];

const projects: PublicProject[] = [
  {
    id: "proj-critical-load-power-refresh",
    slug: "critical-load-power-refresh",
    title: "Critical Load Power Refresh",
    summary:
      "A structured UPS modernization concept for a business-critical equipment room, from load review through commissioning.",
    category: "UPS modernization",
    location: "Location available on request",
    result: "Improved resilience and a clearer maintenance path.",
    image_url: "",
    featured: true,
  },
  {
    id: "proj-battery-lifecycle-program",
    slug: "battery-lifecycle-program",
    title: "Battery Lifecycle Program",
    summary:
      "A preventive battery inspection and staged replacement program designed to reduce avoidable runtime risk.",
    category: "Preventive maintenance",
    location: "Location available on request",
    result: "Better visibility into battery condition and replacement priorities.",
    image_url: "",
    featured: true,
  },
  {
    id: "proj-backup-power-assessment",
    slug: "backup-power-assessment",
    title: "Backup Power Assessment",
    summary:
      "A power-protection review mapping critical loads, current risks, and practical next-step recommendations.",
    category: "Consulting",
    location: "Location available on request",
    result: "A prioritized roadmap for a more resilient power environment.",
    image_url: "",
    featured: true,
  },
];

export function getPublicContent(): PublicContent {
  return {
    services: [...services].sort((a, b) => a.display_order - b.display_order),
    projects: [...projects],
    settings: { ...settings },
  };
}
