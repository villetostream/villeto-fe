# Villeto Frontend – Comprehensive Fix & Improvement Prompt (Final)

> **Context:** You are a senior frontend engineer working on **Villeto** — a B2B fintech SaaS platform (Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Query, Zod, Axios). Your role is **frontend only**. Backend endpoints already exist and are referenced via `API_KEYS` in `src/lib/constants/apis.ts`. Do not invent endpoints — only use what already exists in the codebase.
>
> Today's date: **March 28, 2026**. Follow patterns established by professional fintech platforms like Ramp and Brex. The Controlling Officer role has the same permissions as the Organization Owner.

---

## SECTION 1 — ONBOARDING FLOW FIXES

### 1.1 — Remove the `position` field from the pre-onboarding registration form

**Files:** `src/app/pre-onboarding/registration/page.tsx`, `src/lib/schemas/schemas.ts`

- Remove `position` from `registrationSchema` in `schemas.ts`. It is already excluded from the API payload (`const { position, ...payload } = data`) but still validated in Zod and rendered in the UI — dead weight.
- Remove the `FormFieldInput` for `position` from the JSX.
- Remove `position` from `defaultValues` and the `useEffect` reset block.
- Audit `src/stores/useVilletoStore.ts` for any `position` references in the `UserProfile` interface and remove.
- Remove the `// @ts-ignore` comment that was masking the type error caused by this mismatch. Fix the type properly.

---

### 1.2 — Remove the `role` field from `AddBeneficialOwnerModal`

**File:** `src/components/onboarding/AddBeneficialOwner.tsx`

- When `mode === "beneficial"` or `isOwner === true`, remove the `role` field entirely — both the `FormFieldInput` JSX and its Zod schema branch in `getFormSchema()`.
- Update `getFormSchema(mode, isOwner)` in `src/lib/schemas/schemas.ts` to exclude `role` for beneficial owners.
- Fix the nonsensical ternary in `onSubmit`: `role: mode === "beneficial" ? data.role : data.role || data.role` — both sides are identical. After removing `role` from beneficial mode, remove this line entirely.
- Update `LeaderShipPayload` in `src/actions/onboarding/update-leadership.ts` — `role` should not be sent for beneficial owners.
- Update `OwnerCard` in `src/app/onboarding/leadership/page.tsx` to not display `owner.role` for beneficial owners.
- Remove ALL `console.log` calls from this file: `console.log({ schema })`, `console.log({ errors })`, `console.log({ isBeneficialOwner })`.

---

### 1.3 — Move the welcome email / password generation trigger from Step 5 to Step 6

**Critical bug:** `useUpdateOnboardingProductsApi` fires on Step 5 (Choose Villeto Products) Continue click, triggering the backend to send the welcome email and generate the onboarding user's Villeto password. This is wrong — it must only happen at Step 6 (Review & Confirmation) Submit.

**Step 5 (`src/app/onboarding/products/page.tsx`):**
- `handleContinue` should call `useUpdateOnboardingProductsApi` only to save product selections (`PATCH onboardings/:id/products`) without triggering account creation or sending any email.
- After a successful save, navigate to `/onboarding/review`. Nothing else happens at this step.

**Step 6 (`src/app/onboarding/review/page.tsx`):**
- `submitApplication` in `src/stores/useVilletoStore.ts` currently only does `set({ showCongratulations: true })` — no real API call is made. This is completely fake. Fix it.
- Replace `submitApplication` with a proper async function on the review page that calls the finalization endpoint found in `src/actions/pre-onboarding/confirm-onbarding-status.ts`.
- Only on a successful Step 6 API response should the backend send the welcome email and generate the password.
- Show a loading state on the Submit button during the call.
- Show `CongratulationsModal` only after a successful response.
- Show a `toast.error` if the submission fails.

---

### 1.4 — Beneficial owner invitation: connect to the admin invite endpoint at Step 6

**Requirement:** Beneficial owners added during Step 3 (Leadership) must receive an invitation email using the same mechanism as the Invite Leadership & Admin page, which calls `POST companies/admins/invites` with `{ admins: [{ email, roleId, percentageOfOwnership? }] }`.

**During Step 3 (`src/app/onboarding/leadership/page.tsx`):**
- Continue saving to the onboarding record via `useUpdateOnboardingLeadersApi`. No change here.
- Remove `console.log({ person })` from `handleAddPerson`.
- Do **not** send the admin invite at this step.

**During Step 6 (inside the final submit flow):**
- After the onboarding finalization API call succeeds, call `POST companies/admins/invites`:
  ```ts
  const admins = beneficialOwners.map(owner => ({
    email: owner.email,
    roleId: /* roleId for ORGANIZATION_OWNER resolved from GET roles?type=villeto */,
    percentageOfOwnership: owner.ownershipPercentage,
  }));
  await axios.post(API_KEYS.COMPANY.ADMIN_INVITES, { admins });
  ```
- Fetch available roles from `API_KEYS.ROLE.ROLES_VILLETO` to resolve the correct `roleId` for the organization owner role. Do this once before submitting, not on every render.
- This exactly mirrors what `InviteLeadershipPage` does in `src/app/(dashboard)/people/invite/leadership/page.tsx` — extract the invite logic into a shared hook if appropriate.
- If this call fails, show a `toast.error` but do not block `CongratulationsModal` — inform the user to retry from the People section.

---

### 1.5 — Display company name and logo from Step 3 onward

**Files:** `src/components/onboarding/_shared/OnboardingSidebar.tsx`, `src/app/onboarding/layout.tsx`

Step 2 is where the user **inputs** the business name and logo. From **Step 3 (Beneficial Owner) onward** this data is known and must be displayed.

- Read `businessSnapshot.businessName` and `businessSnapshot.logo` from `useOnboardingStore()` (already persisted to cookie via `onboarding_business` and hydrated by `useHydrateOnboardingData`).
- In the onboarding sidebar or top bar, from Step 3 onward:
  - If `businessSnapshot.logo` exists: render the company logo.
  - If no logo: generate a styled initials avatar (e.g. "Acme Corp" → "AC") in a circle with the primary color background.
  - Display `businessName` text alongside.
- Step 2 continues to show the default Villeto branding — the user hasn't submitted yet.

---

## SECTION 2 — PASSWORD RESET & FIRST LOGIN: FULL AUDIT & FIX

This section covers three separate broken implementations that all need to be unified.

### 2.1 — Delete `src/app/set-password/page.tsx`

This standalone page's `onSubmit` calls `console.log(data)` then routes away. No API is called. A user clicking "Save Password" silently discards their input on a fintech platform. Delete it entirely.

1. Delete `src/app/set-password/page.tsx` and `src/app/set-password/loading.tsx`.
2. Search for `router.push("/set-password")` or `href="/set-password"` — replace with the modal approach described below.

### 2.2 — Fix `ChangePasswordModal` — it calls `setTimeout` instead of an API

**File:** `src/components/auth/ChangePasswordModal.tsx`

`handleSubmit` currently does:
```ts
await new Promise((resolve) => setTimeout(resolve, 1000));
toast.success("Password set successfully!");
```
There is **no API call**. This is the modal shown to first-time users in `DashboardModals.tsx`. Users believe they have set a password — nothing happened.

Fix: replace the fake timeout with a real call to `API_KEYS.USER.PASSWORD_SET` (`users/invitation/password-set`) passing `{ password, confirmPassword, email }`. This is identical to what `SetPasswordModal` already does correctly in `src/components/invitation/SetPasswordModal.tsx`.

Consider merging these two modals (`ChangePasswordModal` and `SetPasswordModal`) into one component since they are near-identical — `SetPasswordModal` already has the correct implementation. Use `SetPasswordModal` everywhere.

### 2.3 — Fix `DashboardModals.tsx` — the first-login check is broken JavaScript

**File:** `src/components/dashboard/layout/DashboardModals.tsx`

The current condition:
```ts
if (user.loginCount <= 1 && user.loginCount !>= 1 && user.position === "CONTROLLING_OFFICER") {
```

This has two critical bugs:
1. `user.loginCount !>= 1` is **not valid TypeScript/JavaScript**. `!>= ` is not an operator. This condition silently evaluates incorrectly and the modal never opens.
2. The check is gated on `user.position === "CONTROLLING_OFFICER"` — meaning only Controlling Officers get the first-login password prompt. Every other first-time user (owners, managers, finance admins invited via the people page) bypasses it entirely.

**Fix:**
- The correct condition for triggering the first-login password reset is: any user whose `loginCount === 1` regardless of role.
- `DashboardLayoutContent.tsx` already checks `userData.shouldChangePassword` and routes to `/reset-password` — but that page doesn't exist. Use the modal instead.
- Unify the logic: in `DashboardModals.tsx`, trigger `ChangePasswordModal` (or `SetPasswordModal` after the merge in 2.2) when `user.loginCount === 1` OR `user.shouldChangePassword === true`.
- The modal must be **non-dismissible** on first login — the user cannot skip it. `ChangePasswordModal` already has `onInteractOutside={(e) => e.preventDefault()}` which is correct. Keep it.
- After the password is set successfully, proceed to show `AddCategoryModal` for the org owner/controlling officer to set up expense categories (this flow already exists in `DashboardModals.tsx` — preserve it).

### 2.4 — Fix `DashboardLayoutContent.tsx` — the `/reset-password` redirect goes nowhere

**File:** `src/components/dashboard/layout/DashboardLayoutContent.tsx`

```ts
if (userData.shouldChangePassword) {
  router.replace("/reset-password");
  return;
}
```

The route `/reset-password` does not exist in the codebase (only `/forgot-password` exists). This causes a 404 for any user flagged with `shouldChangePassword`. Remove this redirect. The `DashboardModals.tsx` approach (showing the modal inline) is the correct pattern — remove the routing redirect entirely and let the modal handle it.

---

## SECTION 3 — SECURITY & DEVTOOLS CLEANUP

### 3.1 — Remove ALL debug `console.log` / `console.error` statements

Run `grep -rn "console\." src/` and audit every hit. Known locations that must be fixed:
- `src/components/onboarding/AddBeneficialOwner.tsx` — `console.log({ schema })`, `console.log({ errors })`, `console.log({ isBeneficialOwner })`
- `src/app/onboarding/leadership/page.tsx` — `console.log({ person })`
- `src/app/onboarding/financial/page.tsx` — `console.log({ spendRange })`
- `src/components/dashboard/sidebar/DashboardSidebar.tsx` — `console.error` on fetch failures
- `src/components/dashboard/layout/DashboardLayoutContent.tsx` — `console.error`
- `src/components/auth/ChangePasswordModal.tsx` — `console.error`
- `src/app/login/page.tsx` — `console.error(err)`
- `src/app/(dashboard)/people/invite/leadership/page.tsx` — any debug logs

### 3.2 — Logger utility

Create `src/lib/logger.ts`:
```ts
const isDev = process.env.NODE_ENV === "development";
export const logger = {
  log: (...args: unknown[]) => { if (isDev) console.log(...args); },
  error: (...args: unknown[]) => { if (isDev) console.error(...args); },
  warn: (...args: unknown[]) => { if (isDev) console.warn(...args); },
};
```
Replace all remaining debug logging with `logger.*` so logs are silenced in production automatically.

### 3.3 — Never disable action buttons for unauthorized users — hide them

Disabled buttons leak the permissions model via DevTools inspection. Per Ramp/Brex standard: **do not render** action buttons for unauthorized users. Apply across approve/reject buttons, admin-only controls, and owner-only actions.

### 3.4 — Auth token storage

The `auth-storage` Zustand persist uses `sessionStorage` — readable by any JS on the page. Audit what is being serialized (raw access tokens must not sit in `sessionStorage`). Tokens should be handled server-side in `httpOnly` cookies wherever possible.

---

## SECTION 4 — SIDEBAR, EXPENSES UX & ROLE-BASED ACCESS

### 4.1 — Fix the Expenses sidebar: sub-items must expand without navigating

**File:** `src/components/dashboard/sidebar/DashboardSidebar.tsx`

**Current broken behavior:** The Expenses dropdown (Card Transactions, Reimbursements, Travel) only appears after the user has already navigated into the expenses page. Sub-items are invisible in the sidebar until you enter the page.

**Fix:**
- Clicking the Expenses label in the sidebar must **only** toggle the `Collapsible` open/closed via `toggleMenu("Expenses")` — it must **not** navigate.
- Navigation to specific expense views happens via the child items only.
- On initial render, if `location.startsWith("/expenses")`, auto-expand the Expenses group: initialize `expandedMenus` with `["Expenses"]` when the path matches.
- The active highlight should cover the entire Expenses group whenever any child route (`/expenses/*`) is active.

### 4.2 — Mark non-implemented modules as Coming Soon

**File:** `src/components/dashboard/sidebar/sidebar-constants.tsx`

Add `comingSoon?: boolean` to the `NavItem` and `SubItem` interfaces. Apply `comingSoon: true` to:
- Cards
- Bill Pay
- Insights
- Inbox
- Settings → Entities
- Settings → Apps

In `DashboardSidebar.tsx` when `item.comingSoon === true`:
- Render a small "Coming Soon" pill badge next to the label.
- Apply `opacity-50 cursor-not-allowed`.
- Render as a `<span>` not a `<Link>` — clicking does nothing.

### 4.3 — Fix company expense visibility: no skeleton flash for restricted users

**Files:** `src/components/dashboard/sidebar/DashboardSidebar.tsx`, `src/app/(dashboard)/expenses/page.tsx`

**Problem:** When an Employee logs in, restricted content briefly renders its skeleton before disappearing. The current check `user.villetoRole.name !== "EMPLOYEE"` is a raw string comparison disconnected from the permissions system. Custom roles break silently.

**Fix — Part A (Sidebar):** Replace the raw string comparison with:
```ts
const canViewCompanyExpenses = hasPermission("company_expenses:read");
```

**Fix — Part B (Expenses page):** The company expenses tab and its content must only be **mounted in the DOM** when the user has permission. Gate the render entirely:
```tsx
{canViewCompanyExpenses && <CompanyExpensesTab />}
```
Do not render it and then hide it after loading. This eliminates the skeleton flash entirely.

**Fix — Part C (Expenses page `canViewCompanyExpenses` check):** The same raw string check exists in `src/app/(dashboard)/expenses/page.tsx`:
```ts
const canViewCompanyExpenses =
  !!user?.villetoRole &&
  (user.villetoRole as any)?.name?.toUpperCase() !== "EMPLOYEE" &&
  (user as any)?.position?.toUpperCase() !== "EMPLOYEE";
```
Replace with `hasPermission("company_expenses:read")` using `useAuthStore().hasPermission`.

### 4.4 — Wire real permission strings to the sidebar and populate based on PRD roles

**File:** `src/components/dashboard/sidebar/sidebar-constants.tsx`

**Problem:** Almost every item has `permission: [""]` or `permission: []` — empty strings always return `true` from `hasPermission`, making the entire permission filtering system a no-op. The architecture is correct; the strings were never populated.

**Fix:** Update `navigationItems` with real permission strings that match what the backend returns from `GET auth/permissions/`. Based on the PRD-defined roles, the permission mapping is:

```ts
// Permission strings — use exact names returned by the backend permissions API.
// These align with the PRD role definitions:

// EMPLOYEE: personal expenses only
// MANAGER: personal + company expenses view + approval of direct reports
// FINANCE_ADMIN: everything Manager has + people read + policies + vendors + settings
// ORGANIZATION_OWNER / CONTROLLING_OFFICER: full access (bypassed by hasPermission — no change needed)

export const navigationItems: NavItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    permission: [],             // All roles see the dashboard
    section: "MAIN MENU",
    // ...
  },
  {
    label: "Expenses",
    href: "/expenses",
    permission: [],             // All roles have expenses (personal at minimum)
    section: "MAIN MENU",
    subItems: [
      {
        label: "Card Transactions",
        href: "/expenses/card-transactions",
        permission: ["company_expenses:read"],  // Manager and above
      },
      {
        label: "Reimbursements",
        href: "/expenses/reimbursements",
        permission: [],         // All roles
      },
      {
        label: "Travel",
        href: "/expenses/travel",
        permission: [],
        comingSoon: true,
      },
    ],
  },
  {
    label: "Cards",
    href: "/cards",
    permission: [],
    comingSoon: true,
    section: "MAIN MENU",
  },
  {
    label: "People",
    href: "/people",
    permission: ["users:read", "roles:read", "departments:read"],  // Finance Admin and above
    section: "MANAGEMENT",
  },
  {
    label: "Policies",
    href: "/policies",
    permission: ["expense_policies:read"],   // Finance Admin and above
    section: "MANAGEMENT",
  },
  {
    label: "Bill Pay",
    href: "/bill-pay",
    permission: [],
    comingSoon: true,
    section: "MANAGEMENT",
  },
  {
    label: "Vendors",
    href: "/vendors",
    permission: ["vendors:read"],            // Finance Admin and above
    section: "MANAGEMENT",
  },
  {
    label: "Insights",
    href: "/insights",
    permission: [],
    comingSoon: true,
    section: "ANALYTICS",
  },
  {
    label: "Inbox",
    href: "/inbox",
    permission: [],
    comingSoon: true,
    section: "OTHERS",
  },
  {
    label: "Settings",
    href: "/settings/data-integration",
    permission: [],
    section: "OTHERS",
    subItems: [
      {
        label: "Expense Policy",
        href: "/settings/expense-policy",
        permission: ["expense_policies:read"],
      },
      {
        label: "Company Settings",
        href: "/settings/company-settings",
        permission: ["company:read"],
      },
      {
        label: "Entities",
        href: "/settings/entities",
        permission: [],
        comingSoon: true,
      },
      {
        label: "Apps",
        href: "/settings/apps",
        permission: [],
        comingSoon: true,
      },
      {
        label: "Personal Settings",
        href: "/settings/personal-settings",
        permission: [],  // All roles
      },
    ],
  },
];
```

**Important:** The exact permission strings (`"users:read"`, `"expense_policies:read"` etc.) must match what `GET auth/permissions/` returns for each role. Before finalizing, compare these strings against the backend response. The PRD roles are:
- **Employee**: personal expenses, personal settings, dashboard
- **Manager**: Employee permissions + company expense view + can approve direct reports
- **Finance Admin**: Manager permissions + People, Policies, Vendors, Company Settings, Expense Policy
- **Organization Owner / Controlling Officer**: Full access (already bypassed in `hasPermission`)

Custom roles created in the People → Create Role page will receive their specific permissions from the backend at login — the existing pipeline handles them correctly once the permission strings are real.

### 4.5 — Expense report approval: hierarchy-based, not role-based

**Create:** `src/core/permissions/expensePermissions.ts`

```ts
export function canApproveReport(
  currentUser: { userId: string },
  report: { creatorManagerId?: string | null }
): boolean {
  // Only the direct manager of the expense creator can approve
  return !!report.creatorManagerId && report.creatorManagerId === currentUser.userId;
}
```

- Apply in `src/components/expenses/ApprovalModal.tsx` and all approve/reject button renders.
- A Controlling Officer or Owner who is **not** the direct manager can view but cannot approve.
- Never check `role === "CONTROLLING_OFFICER"` to gate approval — use the hierarchy check only.
- **Hide** approve/reject buttons entirely when `canApproveReport` returns false. Never disable them.

### 4.6 — Centralize the Roles constant

**Create:** `src/core/permissions/roles.ts`

```ts
export const Roles = {
  EMPLOYEE: "EMPLOYEE",
  MANAGER: "MANAGER",
  FINANCE_ADMIN: "FINANCE_ADMIN",
  ORGANIZATION_OWNER: "ORGANIZATION_OWNER",
  CONTROLLING_OFFICER: "CONTROLLING_OFFICER",
} as const;

export type RoleName = typeof Roles[keyof typeof Roles];
```

Replace all inline role name strings scattered across components with imports from this file.

### 4.7 — Fix company data fetch in `DashboardSidebar` — use React Query

**File:** `src/components/dashboard/sidebar/DashboardSidebar.tsx`

The company logo/name is fetched in a raw `useEffect` + `useState` + `axios` pattern. This means no caching — on every route change the sidebar remounts and re-fetches, causing the logo to flicker. Replace with a React Query `useQuery` call with a stable query key from `api-query-key.ts`. One request, cached for the session, no flicker.

---

## SECTION 5 — CURRENCY & COUNTRY HANDLING

### 5.1 — Restrict country of registration to four supported countries

**File:** `src/app/onboarding/business/page.tsx`

The country dropdown must only show:

| Display Name | 3-Letter Code |
|---|---|
| Nigeria | NGA |
| Ghana | GHA |
| Kenya | KEN |
| South Africa | ZAF |

Also fix the wrong dial codes in `COUNTRY_DIAL_CODES` in that same file:
- `GHN` → `GHA` (Ghana, +233)
- `KYA` → `KEN` (Kenya, +254)
- Add `ZAF` → `+27` (South Africa)

### 5.2 — Create the currency + country utility

**Create:** `src/lib/utils/currency.ts`

```ts
export interface CurrencyConfig {
  symbol: string;
  code: string;
  name: string;
  spendingRanges: {
    value: number;
    label: string;       // display label shown in UI
    lower: number;       // raw number sent to backend
    upper: number | null;
  }[];
}

export const COUNTRY_CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  NGA: {
    symbol: "₦", code: "NGN", name: "Nigerian Naira",
    spendingRanges: [
      { value: 0, label: "< ₦10M",        lower: 0,            upper: 10_000_000 },
      { value: 1, label: "₦10M – ₦50M",   lower: 10_000_000,   upper: 50_000_000 },
      { value: 2, label: "₦50M – ₦200M",  lower: 50_000_000,   upper: 200_000_000 },
      { value: 3, label: "₦200M+",        lower: 200_000_000,  upper: null },
    ],
  },
  GHA: {
    symbol: "₵", code: "GHS", name: "Ghanaian Cedi",
    spendingRanges: [
      { value: 0, label: "< ₵500K",        lower: 0,          upper: 500_000 },
      { value: 1, label: "₵500K – ₵2M",    lower: 500_000,    upper: 2_000_000 },
      { value: 2, label: "₵2M – ₵10M",     lower: 2_000_000,  upper: 10_000_000 },
      { value: 3, label: "₵10M+",          lower: 10_000_000, upper: null },
    ],
  },
  KEN: {
    symbol: "KSh", code: "KES", name: "Kenyan Shilling",
    spendingRanges: [
      { value: 0, label: "< KSh 5M",       lower: 0,           upper: 5_000_000 },
      { value: 1, label: "KSh 5M – 20M",   lower: 5_000_000,   upper: 20_000_000 },
      { value: 2, label: "KSh 20M – 100M", lower: 20_000_000,  upper: 100_000_000 },
      { value: 3, label: "KSh 100M+",      lower: 100_000_000, upper: null },
    ],
  },
  ZAF: {
    symbol: "R", code: "ZAR", name: "South African Rand",
    spendingRanges: [
      { value: 0, label: "< R2M",        lower: 0,           upper: 2_000_000 },
      { value: 1, label: "R2M – R10M",   lower: 2_000_000,   upper: 10_000_000 },
      { value: 2, label: "R10M – R50M",  lower: 10_000_000,  upper: 50_000_000 },
      { value: 3, label: "R50M+",        lower: 50_000_000,  upper: null },
    ],
  },
};

export function getCurrencyConfig(countryCode: string): CurrencyConfig {
  return COUNTRY_CURRENCY_CONFIG[countryCode] ?? COUNTRY_CURRENCY_CONFIG["NGA"];
}
```

**Create:** `src/lib/utils/countries.ts`

```ts
export const ISO3_TO_COUNTRY_NAME: Record<string, string> = {
  NGA: "Nigeria",
  GHA: "Ghana",
  KEN: "Kenya",
  ZAF: "South Africa",
};

export function getCountryName(code: string): string {
  return ISO3_TO_COUNTRY_NAME[code] ?? code;
}
```

### 5.3 — Wire the spending slider to the selected country — store-derived, no backend fetch

**File:** `src/components/onboarding/financial/SpendingSlider.tsx`

The slider currently hardcodes USD-based ranges. Replace the static `spendingRanges` array with a dynamic one derived from the Zustand store — no API call needed, the country was already selected in Step 2 and is in the store:

```ts
// SpendingSlider.tsx
import { useOnboardingStore } from "@/stores/useVilletoStore";
import { getCurrencyConfig } from "@/lib/utils/currency";

export const SpendingSlider = () => {
  const { monthlySpend, businessSnapshot, setMonthlySpend, setSpendRange } = useOnboardingStore();
  const config = getCurrencyConfig(businessSnapshot.countryOfRegistration);
  const spendingRanges = config.spendingRanges;
  // ...rest of component uses config.spendingRanges instead of the hardcoded array
};
```

- The displayed label (the value shown to the right of the slider header) must come from `config.spendingRanges[monthlySpend].label`.
- The range tick labels at the bottom must also use `config.spendingRanges[n].label`.
- Update `setMonthlySpend` in the store: the `ranges` array it reads to set `spendRange` must come from the country config, not the hardcoded dollar array. Pass `config.spendingRanges[spend].label` as the range string, or derive it in the component before calling the setter.
- The `handleSubmit` in `src/app/onboarding/financial/page.tsx` already reads `selectedRange.lower` and `selectedRange.upper` — ensure it reads from the dynamic `config.spendingRanges` not the old hardcoded export.
- Also remove the `console.log({ spendRange })` from `financial/page.tsx`.

### 5.4 — Replace all hardcoded `$` symbols across the dashboard

After login, `countryOfRegistration` is available from the user's company data (returned in `/users/me` and stored in `auth-stores.ts`). Use `getCurrencyConfig` to resolve the symbol globally.

Add to `auth-stores.ts`:
```ts
getCurrencySymbol: (): string => {
  const countryCode = get().user?.company?.countryOfRegistration ?? "";
  return getCurrencyConfig(countryCode).symbol;
}
```

Replace hardcoded `$` in:
- `StatCard` component
- `src/components/policies/PolicyCreationModal.tsx` → `NumberInput` component (the `$` prefix in the input)
- Expense amount input fields and display values across the app

### 5.5 — Policy creation modal: default location to full country name

**File:** `src/components/policies/PolicyCreationModal.tsx`

- The `locations` state initializes to `["Global"]`. Change it to initialize from `getCountryName(user?.company?.countryOfRegistration ?? "")` using the `getCountryName` utility created in 5.2.
- Import `useAuthStore` to read the user's country.

---

## SECTION 6 — POLICY CREATION MODAL: PAYLOAD REDESIGN

### 6.1 — The current payload structure is broken and does not represent the modal's data

**File:** `src/actions/companies/create-policy.ts`

The current `CreatePolicyPayload` creates one policy record **per expense category** selected — if the user picks 3 categories, 3 separate policy records are created with duplicated data. This is wrong. One policy governs multiple categories.

Additionally the payload ignores: departments, multiple approvers, locations, `draft` status, and it collapses all rules into a single `approvalLimit` field.

**Fix:** Update `CreatePolicyPayload` in `create-policy.ts` to match the full data the modal collects. Update `handleConfirm` in `PolicyCreationModal.tsx` to build this payload correctly.

The correct payload structure is:

```ts
// src/actions/companies/create-policy.ts

type RuleEnforcement = "hard_block" | "soft_warning";

export interface SpendLimitRule {
  type: "spend_limit";
  timeframe: "daily" | "weekly" | "monthly" | "per_transaction";
  amount: number;        // numeric, not string — parseFloat before sending
  currency: string;      // ISO 4217: "NGN" | "GHS" | "KES" | "ZAR"
  enforcement: RuleEnforcement;
}

export interface ReceiptRequirementRule {
  type: "receipt_requirement";
  requiredAboveAmount: number;
  currency: string;
  enforcement: RuleEnforcement;
}

// Union — extend with new rule types as they are built (merchant_restriction, category_budget, etc.)
export type PolicyRule = SpendLimitRule | ReceiptRequirementRule;

export interface PolicyScopeAll {
  type: "all_employees";
}

export interface PolicyScopeSpecific {
  type: "specific";
  departmentIds: string[];
  roleIds: string[];
}

export type PolicyScope = PolicyScopeAll | PolicyScopeSpecific;

export interface PolicyApprover {
  userId: string;
  order?: number;   // optional sequential ordering for multi-approver chains
}

export interface CreatePolicyPayload {
  name: string;
  description?: string;
  expenseCategoryIds: string[];     // array — one policy, multiple categories
  scope: PolicyScope;
  locations: string[];
  rules: PolicyRule[];
  approvers: PolicyApprover[];
  status: "active" | "draft";
  effectiveFrom?: string;           // ISO 8601
  effectiveTo?: string;             // ISO 8601
}
```

**Concrete example of a correct payload sent from the modal:**
```json
{
  "name": "Engineering Travel Policy",
  "description": "Engineering Travel Policy",
  "expenseCategoryIds": ["cat-uuid-travel", "cat-uuid-meals"],
  "scope": {
    "type": "specific",
    "departmentIds": ["dept-uuid-engineering"],
    "roleIds": ["role-uuid-manager"]
  },
  "locations": ["Nigeria"],
  "rules": [
    {
      "type": "spend_limit",
      "timeframe": "daily",
      "amount": 150000,
      "currency": "NGN",
      "enforcement": "hard_block"
    },
    {
      "type": "receipt_requirement",
      "requiredAboveAmount": 5000,
      "currency": "NGN",
      "enforcement": "soft_warning"
    }
  ],
  "approvers": [
    { "userId": "user-uuid-finance-admin", "order": 1 },
    { "userId": "user-uuid-cfo", "order": 2 }
  ],
  "status": "active"
}
```

**Update `handleConfirm` in `PolicyCreationModal.tsx`:**
```ts
const handleConfirm = async () => {
  const currencyCode = getCurrencyConfig(user?.company?.countryOfRegistration ?? "").code;

  const payload: CreatePolicyPayload = {
    name: policyName,
    description: policyName,
    expenseCategoryIds: categories,                       // array, not per-category loop
    scope: scope === "all"
      ? { type: "all_employees" }
      : { type: "specific", departmentIds: selectedDepts, roleIds: selectedRoles },
    locations,
    rules: rules
      .filter(r => r.amount && r.enforcement)            // only send completed rules
      .map(r => {
        if (r.type === "spend_limit") return {
          type: "spend_limit",
          timeframe: "daily",
          amount: parseFloat(r.amount),
          currency: currencyCode,
          enforcement: r.enforcement === "Hard block" ? "hard_block" : "soft_warning",
        } satisfies SpendLimitRule;
        return {
          type: "receipt_requirement",
          requiredAboveAmount: parseFloat(r.amount),
          currency: currencyCode,
          enforcement: r.enforcement === "Hard block" ? "hard_block" : "soft_warning",
        } satisfies ReceiptRequirementRule;
      }),
    approvers: approvers
      .filter(Boolean)
      .map((userId, index) => ({ userId, order: index + 1 })),
    status: "active",
  };

  await createPolicyMutation.mutateAsync(payload);
  // ...
};
```

**Handle Save as Draft:** Currently `handleSaveDraft` just closes the modal — nothing is saved anywhere. Update it to call the same API with `status: "draft"`. If no backend endpoint exists for draft saving, leave a `// TODO: draft endpoint not yet available` comment and keep the close behavior rather than pretending to save.

### 6.2 — Exclude the logged-in user from the approver list

**File:** `src/components/policies/PolicyCreationModal.tsx`

The `adminOptions` memo filters by role but does not exclude the currently logged-in user. A user can assign themselves as their own policy approver, defeating the purpose.

```ts
const currentUserId = useAuthStore(state => state.user?.userId);

const adminOptions = useMemo<DropdownOption[]>(() =>
  (directoryApi.data?.data ?? [])
    .filter((u: any) =>
      !u.villetoRole?.name?.toLowerCase().includes("employee") &&
      u.userId !== currentUserId    // ← exclude self
    )
    .map((u: any) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.userId ?? u.id,
      subLabel: u.villetoRole?.name || "Administrator",
    })),
  [directoryApi.data?.data, currentUserId]
);
```

---

## SECTION 7 — CODE QUALITY & DRY PRINCIPLES

### 7.1 — Consolidate the two onboarding stores — eliminate the naming collision

`src/stores/useOnboardingStore.ts` (old financial pulse store) and `src/stores/useVilletoStore.ts` both export a store named `useOnboardingStore`. Whichever is imported last silently wins. This is a naming collision on a production fintech product.

- Delete `src/stores/useOnboardingStore.ts` entirely.
- Run `grep -rn "from.*useOnboardingStore"` and ensure all imports resolve to `src/stores/useVilletoStore.ts`.

### 7.2 — Eliminate redundant API calls

- Audit dashboard pages for duplicate fetches of the same resource (roles, users, departments fetched in multiple sibling components simultaneously).
- Lift these to shared React Query hooks with stable `queryKey` values from `src/lib/constants/api-query-key.ts` so the cache is shared and requests are deduplicated.

### 7.3 — Standardize all endpoint references via `API_KEYS`

Search for any raw endpoint strings bypassing `API_KEYS` in `src/lib/constants/apis.ts` (e.g., inline `/companies/admins/invites`). Move all of them into `API_KEYS`. No raw URL strings outside the constants file.

### 7.4 — Eliminate `// @ts-ignore`

Every `// @ts-ignore` in the codebase must be replaced with a proper TypeScript fix. There is at least one in `src/app/pre-onboarding/registration/page.tsx` that will be resolved by fixing the `position` field (Section 1.1).

---

## SECTION 8 — ADDITIONAL SUGGESTIONS (March 2026 Standards)

### 8.1 — Global error boundary

Wrap `src/app/(dashboard)/layout.tsx` in a React error boundary that catches unexpected render errors and displays a recovery UI instead of a blank screen.

### 8.2 — Skeleton loading must never reveal restricted content

Skeleton loaders must only appear for content the user is **permitted to see**. Never render a skeleton for privileged content and then remove it after loading — gate the entire render from the start (see Section 4.3).

### 8.3 — Input sanitization

All user text inputs must be `.trim()`-ed before submission. Audit for any `dangerouslySetInnerHTML` usage and remove it.

### 8.4 — Accessibility baseline

- All interactive elements must have `aria-label` or an associated visible label.
- Modals must trap focus and return focus to the trigger on close (shadcn/ui Dialog does this by default — do not override it).
- Audit for WCAG AA color contrast compliance on light teal text combinations.

### 8.5 — Company logo upload post-onboarding

Add a logo upload control to `src/app/(dashboard)/settings/company-settings/page.tsx` that calls `PATCH` on `API_KEYS.COMPANY.COMPANY_DETAILS` to update the company logo after onboarding is complete.

### 8.6 — Zustand persist middleware for onboarding store

The current cookie persistence pattern in `useVilletoStore.ts` repeats `setCookie(...)` with the full state object inside every single setter. Replace with Zustand's `persist` middleware using a cookie storage adapter — it handles serialization automatically and eliminates the repetitive pattern.

---

## IMPLEMENTATION ORDER

1. **Section 2** — Fix all three broken password reset implementations first (prevents security regressions).
2. **Section 1.1 & 1.2** — Remove `position` and `role` fields from onboarding forms.
3. **Section 1.3** — Fix Step 5 → Step 6 API trigger (highest user-visible impact).
4. **Section 1.4** — Wire beneficial owner invitations to admin invite endpoint at Step 6.
5. **Section 5.1 & 5.2** — Restrict countries and build the currency config (required by 5.3, 5.4, 5.5, 6.1).
6. **Section 5.3 & 5.4** — Wire spending slider and dashboard currency to the selected country.
7. **Section 6** — Policy creation payload redesign and self-approver exclusion.
8. **Section 3** — Security and console cleanup.
9. **Section 4.1 & 4.2** — Expenses sidebar UX fix and Coming Soon gating.
10. **Section 4.3 & 4.4** — Company expense visibility fix and real permission strings.
11. **Section 7** — DRY, store consolidation, code quality.
12. **Section 8** — Additional improvements.

---

## HARD RULES

- Do **not** invent new API endpoints. Use only those defined in `src/lib/constants/apis.ts`.
- Do **not** use `localStorage` for sensitive auth data.
- Do **not** check permissions via inline role name strings in components — use `hasPermission()` or centralized permission utilities.
- Do **not** disable buttons for unauthorized users — hide them entirely (do not render).
- Do **not** leave `console.log` in any committed code — use `logger.*`.
- Do **not** use `// @ts-ignore` — fix the type properly.
- Do **not** nest `<form>` elements.
- Do **not** render privileged content behind a skeleton that gets removed after load — gate the render entirely.
- Do **not** use fake timeouts (`setTimeout`) in place of API calls.
- All new utilities → `src/lib/utils/` or `src/core/permissions/`.
- All new hooks → `src/hooks/` and `src/actions/` following existing patterns.
