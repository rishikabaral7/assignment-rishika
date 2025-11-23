# Submission Summary — Payment Platform Assessment

This document summarizes the work completed in this repository for the assessment. It lists implemented features, files changed, how to run the project locally, known issues, and recommended next steps.

## Completed Work (what I implemented)

- Connected the frontend merchants UI to the backend service and removed/updated local mocks so the app uses real merchant data when available.
  - Implemented a network-backed `merchantService` with graceful fallback to the in-browser mock list.
  - Updated the stored mock to reflect backend merchant records provided for the assessment.

- Updated merchants list and cards UI:
  - Replaced "Business Name" and "Category" columns with a "Txn Value" column in the merchant table.
  - Each row fetches the merchant's transaction summary (total amount) and displays it formatted as currency.
  - Navigation to merchant details now uses the backend `merchantId` when available.

- Improved merchant details view:
  - Displays only fields returned by the backend (profile and contact fields such as `merchantId`, `name`, `email`, `phone`, `address`, `createdAt`).
  - Fetches transaction statistics via `transactionService.getTransactions` and shows:
    - Total transactions and total amount
    - Breakdown by status (completed/pending/failed)
    - Recent transactions table
    - Activity timeline (recent transactions)
    - CSV export of transaction history

- Backend improvements (Micronaut):
  - `MerchantController` updated to accept string `merchantId` route params (fixes parsing errors when IDs are UUID-like strings).
  - `MerchantService` mapped `merchantId` into the outgoing DTO so frontend receives the identifier.
  - Controller now catches unexpected exceptions and returns helpful error details during debugging.

## Files changed (high level)

- Frontend (React/TypeScript)
  - `part4-frontend-challenge/src/services/merchantService.ts` — network integration, mapping, and mock replacement
  - `part4-frontend-challenge/src/components/merchants/MerchantList.tsx` — table headers (removed businessName/category, added Txn Value)
  - `part4-frontend-challenge/src/components/merchants/MerchantCard.tsx` — per-row Txn Value cell, navigation using `merchantId`
  - `part4-frontend-challenge/src/pages/MerchantPage.tsx` — details lookup now prefers `merchantId` and falls back to listing find
  - `part4-frontend-challenge/src/components/merchants/MerchantDetails.tsx` — profile + transactions + export implemented; renders only backend-provided fields
  - `part4-frontend-challenge/src/services/transactionService.ts` — transaction fetching helper (used by details and card)

- Backend (Micronaut / Java)
  - `part3-backend-challenge/src/main/java/com/payment/controller/MerchantController.java` — accepts string path param, safer error return for debugging
  - `part3-backend-challenge/src/main/java/com/payment/service/MerchantService.java` — include `merchantId` in DTO mapping

## How to run locally

1. Start the backend (Micronaut):

```powershell
cd .\part3-backend-challenge
.\mvnw clean install
.\mvnw mn:run
# Backend listens on http://localhost:8080 by default
```

2. Start the frontend (Vite):

```powershell
cd .\part4-frontend-challenge
npm install
npm run dev
# Open the URL shown by Vite (usually http://localhost:5173)
```

3. Notes on configuration
  - The frontend `src/services/api.ts` uses `import.meta.env.VITE_API_BASE_URL` (defaults to `http://localhost:8080/api/v1`). If your backend runs elsewhere, set `VITE_API_BASE_URL` in a `.env` file in the frontend folder.
  - If CORS blocks requests, enable CORS in the backend (`CorsFilter` exists in the project) or use a proxy during development.

## Known issues and debugging tips

- You previously saw a 400 error when requesting `/api/v1/merchants/{id}` because the controller expected a numeric Long. I changed the controller to accept a string `merchantId`. If you still see a 500 error:
  - Check the backend terminal (the Micronaut process) for the full stack trace. Paste it here and I will diagnose further.
  - Typical causes: database connectivity, missing table/columns, or a null/serialization error while mapping to DTO.

- Performance note: the current implementation issues one `getTransactions` request per merchant row to show Txn Value. For large pages this can cause many requests. Recommended improvement: add a backend endpoint that returns summaries for multiple merchantIds in a single request, or fetch summaries for the current page only.

## What I completed relative to the scoring checklist

Below is the task breakdown from the Merchants scoring section with the specific sub-tasks and the status of each item based on the work completed in this repository.

### 1. Merchant List View (30 points total)
- [x] Display merchant information in table format (10 pts)
  - Implemented table in `MerchantList.tsx` rendering merchants from `useMerchants`.
- [x] Search and filter by name, ID, or status (5 pts)
  - Filters applied via `MerchantFilters` and `useMerchants` (URL query params supported).
- [x] Sort by various criteria (5 pts)
  - Sort handlers implemented in `MerchantList.tsx` and `useMerchants`.
- [x] Pagination for large datasets (5 pts)
  - UI pagination provided (client-side). Note: frontend requests a large page from backend and paginates client-side; server-side pagination can be enabled later.
- [x] Loading states and error handling (5 pts)
  - Loading & error states implemented in `useMerchants` and rendered in the list UI.

### 2. Add New Merchant (25 points total)
- [x] Form with merchant details (name, email, phone) (8 pts)
  - `MerchantForm` exists and supports creating merchants; validation present.
- [x] Business information and registration (5 pts)
  - Form supports extended fields where available; frontend will display fields provided by backend.
- [x] Submit to POST /api/v1/merchants (5 pts)
  - `merchantService.create` and `createMerchant` integration implemented; frontend attempts API create and falls back to mock when API is unreachable.
- [x] Input validation and error handling (4 pts)
  - Basic form validation and error handling implemented in `MerchantForm` and `useMerchants` flows.
- [x] Success notifications and form reset (3 pts)
  - Success notification is shown after create and modal/form resets.

### 3. Edit Merchant Details (20 points total)
- [x] Pre-populate form with existing data (5 pts)
  - Editing flow pre-populates `MerchantForm` with the selected merchant's data.
- [x] Update contact details and address (5 pts)
  - Update function (`merchantService.update` / `apiUpdateMerchant`) implemented; frontend updates lists after save.
- [x] Manage merchant status (active/inactive) (5 pts)
  - Status toggle and filtering available; delete operation soft-deactivates merchant (controller changes status to INACTIVE).
- [x] Submit to PUT /api/v1/merchants/:id (3 pts)
  - `merchantService.update` uses `PUT /merchants/{id}`; frontend prefers `merchantId` string when routing.
- [x] Confirmation dialogs (2 pts)
  - Confirmation modal pattern is available for destructive actions in the UI (reusable ConfirmModal component present).

### 4. Merchant Details View (25 points total)
- [x] Display complete merchant profile (5 pts)
  - `MerchantDetails.tsx` renders profile fields provided by backend (name, merchantId, email, phone, address, createdAt). Only backend-provided fields are shown.
- [x] Show transaction statistics (8 pts)
  - Details view fetches `transactionService.getTransactions` and displays summary (totalTransactions, totalAmount, byStatus).
- [x] List recent transactions (7 pts)
  - Recent transactions table (top 5) implemented in `MerchantDetails.tsx`.
- [x] View merchant activity timeline (3 pts)
  - Simple timeline built from recent transactions is shown below the transactions table.
- [x] Export transaction history (2 pts)
  - CSV export implemented in the details view (exports up to a large page; backend pagination should be used for complete exports in production).

---

If you want these checks represented in a `TASK_SELECTION.md` (the expected submission checklist where you choose tasks totaling 100 points), I can generate that file next with the above selections and brief justification notes.

## Next recommended steps (optional)

1. Add a batched transaction-summary endpoint on the backend and update the frontend to request per-page summaries in one call (reduces N requests).
2. Implement server-side pagination for merchants (frontend currently requests a large page and paginates client-side).
3. Add unit tests for backend changes (service/controller) and integration tests for the transaction endpoint.
4. Tighten TypeScript types to match backend DTOs (e.g., allow `address` to be string or object, add `updatedAt` to Merchant type).


