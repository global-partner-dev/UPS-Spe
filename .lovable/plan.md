# UPS Spe Website Plan

## Goal
Build a polished, fast company website that presents UPS Spe as a credible power-protection partner and turns visitors into qualified quote requests. The site will use the supplied logo, the #1677FF brand blue, and the dark technical visual direction shown in the reference.

## Public website
- A responsive homepage with a strong UPS Spe identity, services overview, proof points, featured projects, process, maintenance callout, and quote request section.
- Dedicated Services, Projects, About, Contact, Terms, and Privacy pages.
- Clear navigation on desktop and mobile, plus accessible forms and controls.
- Quote form fields for contact details, company, service need, equipment context, and message, with validation, consent, spam protection, and clear success/error states.
- Terms and Privacy content based on the supplied document; unresolved legal placeholders will be shown conservatively rather than inventing business details.

## Lightweight CMS
- A secure owner dashboard for editing services, projects, site contact details, and quote requests.
- Email/password sign-in for the site owner.
- Project management with title, summary, service category, location, outcome, status, and image URL.
- Service management with title, description, icon choice, display order, and published status.
- Site settings for email, phone, business location, and availability text.
- Quote inbox with status tracking.

## Visual direction
- Deep navy technical surfaces, crisp electric-blue highlights, white space, and restrained motion.
- Use the supplied UPS Spe logo directly and derive the browser icon from it.
- Generate original UPS/data-center imagery that matches the visual language instead of using placeholders.
- Strong typography, clear hierarchy, compact cards, and detailed industrial photography.

## Technical details
- TanStack Start full-stack React app with Lovable Cloud for the database, secure CMS access, and quote storage.
- Public content reads are limited to published entries; CMS writes require an authenticated owner role checked on the server.
- Database access rules, user-role separation, validation, and rate-limited form submission will be included.
- Each page receives unique search and social metadata.
- Verify build health and key desktop/mobile flows in the browser before completion.

## Initial content
Use professional English copy aligned with the supplied proposal and policy document. Seed representative services and portfolio examples as editable draft-quality content, without inventing customer names, certifications, addresses, phone numbers, or performance claims.
