<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Auth form validation rules live in src/lib/auth-schemas.ts (zod) with tests beside it; why: one source of truth for register/login rules.
- Roles live in public.user_roles (enum app_role: farmer/officer/admin); signup trigger assigns farmer or officer only, admin is granted by an admin; why: prevent self-promotion to admin.
- Each role has its own page under src/routes/_authenticated/ guarded by the role from the layout context; /dashboard redirects by role.
- Registration records are read through an authenticated server function that checks the stored admin role before loading the privileged auth client; only an explicit safe-field projection reaches the dashboard.
- Keep the home-page sample leaf scan in a browser-safe presentation component with no diagnostic API calls; why: the interactive concept must remain separate from real plant-health analysis.
- Import the generated home and sample-leaf images as bundled local assets; why: GitHub clones must render them without the hosted asset proxy.
- Admin dashboard analytics are derived from the existing safe registration projection in a browser-safe summary module, with Bangladesh calendar dates; why: richer reporting must not widen privileged data access.
