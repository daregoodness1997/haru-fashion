# Copilot Instructions for Shunapee Fashion House

## Project Overview

- **Shunapee Fashion House** is a Next.js e-commerce web app using TypeScript, Tailwind CSS, and React Context API for state management.

- Features include authentication, cart, wishlist, search, i18n (English & Burmese), and responsive design.

## Key Architecture & Patterns

- **Pages**: All routes are in `pages/`. Dynamic routes for products and categories are in `pages/products/[id].tsx` and `pages/product-category/[category].tsx`.
- **Components**: UI is modularized in `components/` (e.g., `Auth/`, `CartItem/`, `Header/`, `HeroSection/`).
- **State Management**: Uses React Context for auth (`context/AuthContext.tsx`), cart (`context/cart/CartContext.ts`), and wishlist (`context/wishlist/WishlistContext.ts`). Each has a provider and reducer pattern.
- **Styling**: Tailwind CSS is configured in `tailwind.config.js` and used throughout. Some components use CSS modules.
- **i18n**: Language files are in `messages/common/` (`en.json`, `my.json`).
- **Utilities**: Shared logic in `components/Util/` and `context/cart/Util/`.
- **Icons**: Custom SVG icons in `public/icons/`.

## Developer Workflows

- **Install dependencies**: `npm install`
- **Run locally**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Docker**: Use the `Dockerfile` for containerization.
- **Styling**: Use Tailwind utility classes. For custom styles, prefer CSS modules in the relevant component folder.
- **State**: Add new context logic by following the provider/reducer pattern in `context/`.
- **Internationalization**: Add new keys to both `en.json` and `my.json`.

## Project Conventions

- **Component Naming**: Use PascalCase for components and folders.
- **File Organization**: Group related files (component, styles, tests) in the same folder.
- **TypeScript**: Use explicit types for props and context values. Types are in `context/cart/cart-types.ts` and `context/wishlist/wishlist-type.ts`.
- **No Redux**: All state is managed via Context API, not Redux.
- **No direct API calls in components**: Use utility functions for API logic.

## Integration Points

- **Backend**: All data comes from the Shunapee Fashion House REST API. Update endpoints in utility functions if backend changes.
- **Deployment**: Vercel is used for deployment. See `README.md` for details.

## Examples

- To add a new cart feature, update `context/cart/CartProvider.tsx` and `context/cart/cartReducer.ts`.
- To add a new language, add a new JSON file in `messages/common/` and update i18n logic.
- For a new UI section, create a folder in `components/` and use Tailwind for styling.

---

For more details, see `README.md` and explore the `components/` and `context/` directories.
