## Project architecture

- Marketing content (services, projects, contact details) lives in `src/lib/site-data.ts` as static frontend data.
- Public marketing pages are independent TanStack routes sharing site header, footer, page header, and content loaders for consistent navigation and search metadata.
