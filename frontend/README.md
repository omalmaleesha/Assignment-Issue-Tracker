# Issue Tracker Frontend

Modern, production-ready Issue Tracker frontend built with:

- React + Vite
- TypeScript (strict)
- Redux Toolkit
- React Router
- Axios (with interceptors)
- Tailwind CSS

## Features

- Authentication (Login/Register)
  - Form validation (email/password rules)
  - Token persistence in Redux + localStorage
  - Protected routes
- Issues Dashboard
  - Search (debounced)
  - Status/priority filters
  - Pagination
  - Loading skeletons and empty states
- Issue Details
  - Rich details layout
  - Edit route
  - Confirmation modal when resolving/closing
  - Optimistic status updates
- Create/Edit Issue
  - Reusable form component
  - Inline validation
  - Focus handling and accessibility-friendly inputs
- UI/UX
  - Responsive layout
  - Dark mode toggle
  - Toast notifications
  - Lazy loaded pages (code splitting)

## Project Structure

```text
src/
  components/
    layout/
    ui/
  constants/
  features/
    auth/
    issues/
  hooks/
  lib/
  routes/
  services/
    api/
  store/
  types/
```

## Environment

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- If token expires, global Axios interceptor emits `app:unauthorized` and user is logged out.
- Tailwind CSS warnings like `Unknown at rule @tailwind` in editor diagnostics are extension/linter-related and do not indicate runtime failure when Tailwind/PostCSS is configured correctly.
