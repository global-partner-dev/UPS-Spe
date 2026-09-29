<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Public content and quote requests use Lovable Cloud tables with row-level access controls; owner edits use authenticated server functions because the CMS must remain lightweight and secure.
- Public marketing pages are independent TanStack routes sharing site header, footer, page header, and content functions for consistent navigation and search metadata.
