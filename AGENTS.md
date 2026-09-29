## Project architecture

- Public content and quote requests use Supabase tables with row-level access controls; owner edits use authenticated server functions because the CMS must remain lightweight and secure.
- Public marketing pages are independent TanStack routes sharing site header, footer, page header, and content functions for consistent navigation and search metadata.
