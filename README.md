# SteadiStock — Commercial Operations Suite

A browser-based, multi-branch Point-of-Sale and inventory management system. All data lives in the browser's `localStorage` — no backend or database is required to run it.

---

## Tech Stack & Versions

| Layer | Technology | Version |
|---|---|---|
| UI Library | React | 18.3.1 |
| Language | TypeScript | ~5.8.2 |
| Build Tool | Vite | 6.2.0 |
| Routing | React Router DOM | 7.2.0 |
| Styling | Tailwind CSS | 4.1.14 |
| Animation | Motion (Framer Motion) | 12.23.24 |
| Icons | Lucide React | 0.546.0 |
| Head Management | React Helmet Async | 2.0.5 |
| Class Utilities | clsx + tailwind-merge | 2.1.1 / 3.0.1 |
| Dev Server | Vite + @vitejs/plugin-react | 5.0.4 |

---

## Project Structure

```
src/
├── main.tsx                  # App entry point
├── App.tsx                   # Root component, splash screen logic
├── index.css                 # Global styles, CSS variables, dark mode
├── types.ts                  # All shared TypeScript interfaces
├── api/
│   └── initialData.ts        # Seed products and category constants
├── context/
│   └── StoreContext.tsx      # Global state (inventory, cart, sales, users, branches)
├── hooks/
│   └── useLocalStorage.ts    # Typed localStorage hook
├── lib/
│   └── utils.ts              # cn() class merger, formatCurrency(), generateId()
├── routes/
│   └── AppRoutes.tsx         # Auth guard, layout shell, branch selector
├── components/
│   ├── ui/
│   │   ├── Button.tsx        # Reusable button component
│   │   ├── Input.tsx         # Reusable input component
│   │   └── Card.tsx          # Reusable card wrapper
│   └── layout/
│       ├── Sidebar.tsx       # Collapsible navigation sidebar
│       └── SplashScreen.tsx  # Animated boot screen
└── pages/
    ├── Login.tsx             # Login / sign-up / password recovery
    ├── Dashboard.tsx         # KPI overview, recent sales, stock summary
    ├── Inventory.tsx         # Product table, add/edit/delete modal
    ├── POS.tsx               # Checkout terminal, cart, payment modals
    ├── Reports.tsx           # Analytics, printable report, per-sale invoices
    ├── Settings.tsx          # Profile, preferences, branch management, data erase
    ├── Help.tsx              # FAQ / support page
    └── Policy.tsx            # Privacy, Terms, Security policy viewer
```

---

## Data & State

### TypeScript Types (`src/types.ts`)

**`Product`** — `{ id, name, category, price, stock, image, description?, branchId }`

**`CartItem`** — extends `Product` with `quantity`

**`Sale`** — `{ id, timestamp, items[], total, paymentMethod, customerName?, customerId?, branchId, cardDetails? }`

**`Branch`** — `{ id, name, location }`

**`User`** — `{ id, name, email, role ('admin'|'staff'), preferences: { notifications, language, theme } }`

**`TimeFilter`** — `'today' | 'week' | 'month' | 'year' | 'all'`

**`Category`** — `'Electronics' | 'Clothing' | 'Food & Beverage' | 'Home & Living' | 'Health & Beauty'`

### Global Store (`src/context/StoreContext.tsx`)

Implemented as a React Context. Every piece of state is synced to `localStorage` via `useLocalStorage`. No server calls are made anywhere.

State slices and their storage keys:

| Slice | localStorage key | Initial Value |
|---|---|---|
| inventory | `steadi_inventory` | 3 seed products |
| cart | `steadi_cart` | `[]` |
| sales | `steadi_sales` | `[]` |
| user | `steadi_user` | `null` |
| branches | `steadi_branches` | Main Branch, Karachi |
| selectedBranchId | `steadi_selected_branch` | `'main'` |

Exposed actions: `addToCart`, `removeFromCart`, `updateCartQuantity`, `checkout`, `clearCart`, `addProduct`, `updateProduct`, `deleteProduct`, `login`, `logout`, `updateUser`, `updatePreferences`, `addBranch`, `deleteBranch`, `selectBranch`.

**`checkout()`** — validates stock for all cart items, deducts stock from inventory atomically, creates a `Sale` record with a generated ID, and clears the cart. Returns `false` if cart is empty or any item is under-stocked.

---

## Startup Sequence

1. `main.tsx` renders `<App />` wrapped in `<React.StrictMode>`.
2. `App.tsx` sets a 2.5-second timer. While the timer runs, `<SplashScreen />` overlays the entire screen.
3. After 2.5 seconds, `<AppRoutes />` takes over. If `user` is `null` in the store, all routes redirect to `/login`. Once logged in, the full layout with sidebar appears.

---

## Routing (`src/routes/AppRoutes.tsx`)

| Path | Page | Auth Required |
|---|---|---|
| `/login` | Login | No |
| `/` | Dashboard | Yes |
| `/inventory` | Inventory | Yes |
| `/pos` | POS System | Yes |
| `/reports` | Reports | Yes |
| `/settings` | Settings | Yes |
| `/help` | Help Center | Yes |
| `/policies/:type` | Policy Viewer | Yes |
| `*` | Redirects to `/` | — |

The layout shell in `AppRoutes` renders a sticky top header with the hamburger menu toggle and a branch selector dropdown. The sidebar is toggled globally from this header.

---

## Pages

### Login (`/login`)

**Purpose:** Authenticates users. No real credentials are validated — any submission logs in as admin.

**UI Structure:**
- Decorative blurred gradient circles in the background.
- A centred card with a tab switcher at the top (two pill-style buttons):
  - **Existing User** tab — shows the login form.
  - **New Branch** tab — shows the sign-up form.

**Login Form:**
| Field | Type | Placeholder |
|---|---|---|
| Operations ID / Email | text | admin@steadi.stock |
| Password | password | •••••••• |

- "Forgot Access Key?" link (text button, right-aligned) opens the Forgot Password modal.
- Submit button: `AUTHORIZE ACCESS` — full-width, 56px tall, orange with shadow.

**Sign-Up Form:**
| Field | Type | Placeholder |
|---|---|---|
| Business Name | text | e.g. Al-Madina Traders |
| Email Address | email | office@steadistock.com |
| New Password | password | Minimum 8 characters |

- Submit button: `CREATE WORKSPACE` — same style as login.
- On submit: shows a browser `alert`, then calls `login('admin')`.

**Forgot Password Modal:**
- Triggered by clicking "Forgot Access Key?".
- Overlays the screen with `bg-black/60 backdrop-blur-sm`.
- Contains a single email field (`type="email"`, `required`, `autoFocus`).
- Submit button: `SEND RESET LINK` — shows a browser `alert` with the entered email, then closes.
- Close button: `XCircle` icon (top-right of modal).

---

### Dashboard (`/`)

**Purpose:** At-a-glance KPI snapshot filtered by branch and time period.

**Controls:**
- Time filter dropdown (top-right): `ALL TIME | TODAY | LAST 7 DAYS | LAST 30 DAYS | LAST YEAR` — filters all stats and the recent sales list.

**KPI Cards (4-column grid on large screens):**
| Card | Value | Icon | Colour |
|---|---|---|---|
| Revenue | Formatted total | TrendingUp | Orange (primary) |
| Orders | Sale count | ShoppingBag | Blue |
| Units Sold | Total items quantity | Users | Indigo |
| Low Stock | Products with stock < 10 | Package | Red |

Each card shows a trend badge (ArrowUpRight / ArrowDownRight) but the percentage is static `0.0%` — a placeholder for future real trend calculation.

**Recent Sales Panel (2/3 width):** Shows the 5 most recent sales for the selected branch and time filter. Each row shows the first item's image, all item names, date, payment method, total, and item count. Empty state shows a clock icon.

**Inventory Overview Panel (1/3 width):** Shows a progress bar of how many items the selected branch has vs total, and the top 3 products with mini stock bars coloured red (< 10 units) or green.

---

### Inventory Control (`/inventory`)

**Purpose:** Manage the product catalogue for the selected branch.

**Admin vs Staff:** Add and delete product buttons are hidden for `role === 'staff'`. The edit button is visible to all roles.

**Filters:**
- Search input: filters by product name or product ID (case-insensitive).
- Category dropdown: filters by one of the 5 fixed categories (or "All").

**Product Table Columns:** Product Info (image + name + SKU), Category (pill badge), Unit Price, In Stock (count + mini progress bar), Actions (Edit icon / Delete icon).

Low-stock rows (`stock < 10`) get a light red row background and a red `AlertCircle` badge overlaid on the product thumbnail.

**Add/Edit Product Modal:**
Triggered by the `ADD NEW PRODUCT` button or any row's edit icon. Full-screen overlay with `bg-black/60 backdrop-blur-sm`.

| Field | Type | Notes |
|---|---|---|
| Product Name | text | Required |
| Category | select | Dropdown with 5 fixed categories |
| Product Photo | hybrid | Two-part: "Device" button opens a hidden `<input type="file" accept="image/*">` which base64-encodes the image; OR paste a URL directly into the adjacent text input |
| Unit Price (Rs.) | number | Step 1, required |
| Stock Quantity | number | Required |

Modal header is orange (`bg-primary`). Close button is a rotated `Plus` icon.

Buttons:
- `CANCEL` (ghost variant) — closes modal without saving.
- `UPDATE PRODUCT` / `CREATE PRODUCT` (primary variant) — submits the form.

---

### POS System (`/pos`)

**Purpose:** The main point-of-sale terminal for processing sales.

**Layout:** Two-column on large screens — product browser on the left, cart panel fixed on the right (380px wide).

**Product Browser:**
- Search input: filters by product name.
- Category filter pills: horizontally scrollable row of buttons (`All` + 5 categories), active pill is orange.
- Product grid: 2 columns on mobile, up to 4 on XL screens. Each card shows product image, name, price, and remaining stock.
  - If a product is in the cart, a small orange badge with the cart quantity appears on the image.
  - If stock is exhausted, the card is greyed out with an `OUT OF STOCK` overlay and is disabled.
  - Clicking an in-stock card calls `addToCart()`.

**Cart Panel:**
- Header: shows cart item count badge, "Clear All" text button (calls `clearCart()`).
- Item rows: product image, name, per-item total price, quantity stepper (`-` / count / `+`), and an `×` remove button. Quantity is capped at available stock.
- Empty state: a shopping bag icon with guidance text.
- Customer Name field: optional plain text input.
- Payment method selector: two toggle buttons — `Cash on Delivery` and `Card`. Active selection turns orange.
- Order total: large black typographic total with item count beside it.
- `CANCEL` button (outline variant): clears the cart.
- `CHECKOUT` button (primary variant): disabled when cart is empty.

**Checkout Flow:**
- If payment is "Card" → opens Card Details Modal.
- If payment is "Cash on Delivery" → opens Cash Confirmation Modal.

**Card Details Modal** (`z-[70]`):

| Field | Type | Constraint |
|---|---|---|
| Card Number | text | maxLength 19 |
| Card Holder Name | text | required |
| Expiry Date | text | maxLength 5, placeholder MM/YY |
| CVV | password | maxLength 3 |

Buttons: `CANCEL` (ghost) and `PAY Rs. X` (primary, shows total).

**Cash Confirmation Modal** (`z-[70]`): Shows total in large typography. Two buttons: `CONFIRM RECEIVED` (calls `performCheckout()`) and `CANCEL & GO BACK`.

**Receipt Modal** (`z-[60]`): Opens after a successful checkout.
- Displays: SteadiStock logo, sale ID, date/time, itemised list (name × quantity → subtotal), total amount, payment method, customer name (if provided), customer ID, and card last-four digits (if card payment).
- Buttons: `PRINT` (calls `window.print()`) and `DONE` (closes modal).

---

### Analytics & Reports (`/reports`)

**Purpose:** Financial performance overview for the selected branch.

**KPI Cards (4-column grid):**
| Card | Value |
|---|---|
| Total Revenue | Sum of all sales |
| Avg Order Value | Revenue ÷ order count |
| Total Invoices | Order count |
| Inventory Value | Sum of (price × stock) for branch |

**Sales by Category:** A list showing up to 5 categories ranked by revenue. Each row has a progress bar showing the category's share of total revenue.

**Transaction History Table:** All sales for the branch with columns: ID, Date, Customer, Items, Payment Method, Amount. Each row has a `Printer` icon that opens a printable invoice in a new tab/window.

**Print Report Button** (top-right): Opens a new window with a formatted HTML report including a summary grid and the full transaction table, then auto-triggers `window.print()`.

**Per-sale Invoice** (per-row printer icon): Opens a separate styled HTML document with the transaction ID, date/time, itemised breakdown, and total. Auto-triggers `window.print()`.

---

### Settings (`/settings`)

**Purpose:** Manage user profile, preferences, branches, and data.

**Profile Card (full-width, two-panel layout):**
- Left panel (orange background): avatar initial, user name, role badge, profile ID (first 7 chars), status, join date.
- Right panel: permission info tiles ("Full System Access", "All Branches Enabled").
- Buttons: `EDIT PROFILE`, `VIEW PUBLIC ID`, `SIGN OUT`.

**Edit Profile Modal:**
| Field | Type | Pre-filled |
|---|---|---|
| Name | text | Current user name |
| Email | text | Current user email |

Buttons: `CANCEL` (ghost), `SAVE CHANGES` (primary).

**View Public ID Modal:** Shows the user's full ID string in a styled display.

**Preferences Section (toggle list):**
| Setting | Control |
|---|---|
| Notifications | Toggle switch (custom CSS pill, orange when on) |
| Language | Select dropdown: English / Urdu / Spanish |
| Dark Mode | Toggle switch |

Dark mode adds the `dark-mode` class to `<html>` and is handled via the `AppRoutes` effect.

**Branch Management Section** (admin only):
Lists all branches with name and location. The "Main Branch" cannot be deleted. Other branches show a red `Trash2` delete button, which opens a confirmation modal before deletion.

**Add Branch Modal:**
| Field | Type | Required |
|---|---|---|
| Branch Name | text | Yes |
| Location / City | text | Yes |

Buttons: `CANCEL` (ghost), `ADD BRANCH` (primary).

**Delete Branch Confirmation Modal:** Shows the branch name. Buttons: `CANCEL`, `DELETE` (danger variant, red).

**Legal & Policies Section:** Three navigation links rendered as list rows with a `ChevronRight` icon — Privacy Policy, Terms of Service, Security Guidelines. Each navigates to `/policies/<type>`.

**Danger Zone — Erase All Data:**
Opens the Erase Data Modal which requires the user to type their registered email to confirm. On match: calls `localStorage.clear()` and `window.location.reload()`. On mismatch: shows a browser `alert`.

---

### Help Center (`/help`)

Static FAQ page with expandable accordion sections covering common usage questions grouped by topic (Getting Started, POS, Inventory, Reports).

---

### Policy Viewer (`/policies/:type`)

Renders one of three static policy documents based on the `:type` URL parameter: `privacy`, `terms`, or `security`. Content is hardcoded JSX — no external fetch.

---

## Reusable UI Components

### `Button` (`src/components/ui/Button.tsx`)

Built with `forwardRef`. Extends `HTMLButtonElement` props.

| Prop | Values | Default |
|---|---|---|
| `variant` | `primary` `secondary` `outline` `ghost` `danger` `success` | `primary` |
| `size` | `sm` `md` `lg` `icon` | `md` |

Base styles: `inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 focus:ring-2 focus:ring-primary/50`.

Variant styles:
- `primary` — orange background, white text.
- `secondary` — dark text colour background, white text.
- `outline` — 2px orange border, orange text; fills orange on hover.
- `ghost` — transparent; light grey background on hover.
- `danger` — red-500 background.
- `success` — emerald background.

### `Input` (`src/components/ui/Input.tsx`)

Built with `forwardRef`. Extends `HTMLInputElement` props.

| Prop | Purpose |
|---|---|
| `label` | Renders a `<label>` above the input |
| `error` | Renders error text below; turns border red |
| `icon` | (used in Login only via sibling layout, not a formal prop) |

Base styles: `h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary transition-all`.

### `Card` (`src/components/ui/Card.tsx`)

Div wrapper. Props: `title`, `subtitle`, `className`, and all standard `HTMLDivElement` attributes.

Base styles: `bg-white rounded-2xl card-shadow overflow-hidden p-6 border border-gray-100 flex flex-col`.

If `title` or `subtitle` are provided, they render in a header block above the children.

---

## Layout Components

### `SplashScreen` (`src/components/layout/SplashScreen.tsx`)

Fixed, full-viewport overlay (`z-[100]`) on a dark background. Uses `motion` (Framer Motion) for:
- Logo icon: scales from 0.8→1.1→1 on mount, then continuously rocks ±10° and pulses scale.
- Pulsing ring: scales from 1→1.5 while fading to transparent, repeating every 2 seconds.
- Text block: slides in from below with a 0.4s delay.
- Loading bar: a horizontal orange bar that slides left-to-right on a 1.5s linear loop.

Displayed for exactly 2.5 seconds on every page load (controlled by a `setTimeout` in `App.tsx`).

### `Sidebar` (`src/components/layout/Sidebar.tsx`)

Fixed on mobile, sticky on `lg+`. Collapses to `w-0` when `isCollapsed === true`. Transition: 300ms.

On mobile, an overlay (`bg-black/20 backdrop-blur-sm`) covers the rest of the screen when the sidebar is open; clicking it closes the sidebar.

Nav sections:
- **Main Menu:** Dashboard, POS System, Inventory, Reports — each a `NavLink`. Active link gets orange background + shadow.
- **Support:** Help Center, Settings — active link gets soft orange tint.

Bottom of sidebar: user avatar initial, name, role, and a `Sign Out` button that calls `logout()`.

---

## Hooks & Utilities

### `useLocalStorage<T>` (`src/hooks/useLocalStorage.ts`)

Generic typed hook. Initialises state from `localStorage` on first render (with JSON parse fallback). Syncs to `localStorage` via `useEffect` on every state change.

### `utils.ts`

- `cn(...inputs)` — merges Tailwind classes using `clsx` + `tailwind-merge`.
- `formatCurrency(amount)` — formats a number to `Rs. X,XXX.XX` (Pakistani Rupee, `en-PK` locale, `PKR` currency).
- `generateId()` — returns a short 8-character random alphanumeric string.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Type-check only (no emit)
npm run lint
```

Environment variables (copy `.env.example` to `.env`):

---

## Data Persistence Notes

All state is stored client-side in `localStorage`. Clearing the browser's site data or running the "Erase All Data" action in Settings will reset the app to its initial seed state. There is no server, no authentication backend, and no database. The app runs fully offline once loaded.