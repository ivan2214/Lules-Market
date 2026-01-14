# Example: Screaming App Structure (Next.js 15+)

This structure shows a Next.js application where the folder hierarchy clearly communicates business intent.

Key principles demonstrated:
- App Router only
- Feature-based route groups
- Private folders for feature internals
- Shared code only when used by multiple features

```

src/
app/
(auth)/
login/
page.tsx
_components/
login-form.tsx
register/
page.tsx
_components/
register-form.tsx
_components/
social-login.tsx
_actions/
auth-actions.ts
layout.tsx

```
(dashboard)/
  dashboard/
    page.tsx
    loading.tsx
    _components/
      stats-card.tsx
  profile/
    page.tsx
    _components/
      profile-form.tsx
  layout.tsx
```

shared/
components/
ui/
button.tsx
card.tsx

```

Why this is correct:
- `social-login` is shared only within `(auth)` → stays private
- `button` and `card` are used across features → go to `shared/`
- No technical folders (`components`, `hooks`) at the root of `app/`