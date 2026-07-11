# ModuComm: Modular eCommerce Platform

## 1. Technology Stack
- **Frontend:** React 18+ (TypeScript), Tailwind CSS, Lucide React (Icons), Recharts (Analytics).
- **Backend:** Java (Spring Boot) - *Mocked in frontend services for this demo*.
- **Database:** MySQL - *Simulated via local mock data*.
- **Architecture:** Modular Monolith (Frontend), Fault-Isolated Feature Modules.

## 2. System Architecture Overview
The application follows a strict **Modular Architecture**. Unlike traditional layered architectures (components, services, views), this project is organized by **Feature Domain**. 

### Core Principles
1.  **Fault Isolation:** Every major feature (Products, Admin, Search) is wrapped in a React `ErrorBoundary`. A crash in the "API Connector" module will NOT take down the "Product Storefront".
2.  **Independent Services:** Each module has its own `service.ts` file. They do not share state implicitly.
3.  **Lazy Loading (Simulated):** Modules are designed to be easily split into lazy-loaded chunks in a real build pipeline.

## 3. Feature/Module Breakdown

| Module | Responsibility | Isolation Strategy |
| :--- | :--- | :--- |
| **Auth** | Login, JWT handling, Role checks | Dedicated Context, fails gracefully to "Guest" mode. |
| **Product** | Display products, detailed view | Wrapped in ErrorBoundary. Fails to "Unable to load products". |
| **Search** | Global search bar, fuzzy matching | Independent Service. Failure disables search bar only. |
| **Admin** | Dashboard, API Connector, Inventory | Protected Route. Isolated from public store. |
| **Cart** | Cart management, Checkout simulation | LocalStorage persistence. Isolated failure. |

## 4. Folder Structure

```
/
├── components/         # Shared UI atoms (Buttons, Layouts, ErrorBoundaries)
├── modules/            # DOMAIN MODULES
│   ├── admin/          # Admin Dashboard, API Connector
│   ├── auth/           # Login, Context
│   ├── cart/           # Cart logic
│   ├── products/       # Product list & display
│   └── search/         # Search logic & UI
├── services/           # Base API configuration
├── App.tsx             # Main routing & layout composition
└── types.ts            # Shared domain types
```

## 5. Error Isolation Strategy
We utilize a higher-order component (HOC) or wrapper component `<ErrorBoundary moduleName="...">` around each major route outlet.
- If the **Admin Dashboard** throws an exception (e.g., malformed API config), the **sidebar** and **header** remain visible, allowing navigation back to safety.
- Services allow individual failures: The `SearchService` catches its own errors and returns empty arrays rather than crashing the component tree.

## 6. Search Module Details
- **UI:** `SearchBar` component located in the global `Navbar`.
- **Logic:** `searchService.ts` performs an async query (mocked fuzzy match).
- **Resilience:** If the search service times out or fails, the UI simply shows "No results found" or an error toast, leaving the rest of the Navbar functional.
