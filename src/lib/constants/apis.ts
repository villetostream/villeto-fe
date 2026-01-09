export const API_KEYS = {
  ONBOARDING: {
    ACCOUNT_CONFIRMATION: "onboardings/account-confirmation",
    START_ONBOARDING: "onboardings/start",
    ONBOARDING: "onboardings",
    ONBOARDING_COMPANY_DETAILS: (id: string) => `onboardings/${id}/company-details` as const,
    ONBOARDING_LEADERS: (id: string) => `onboardings/${id}/leaders` as const,
    ONBOARDING_FINANCIAL: (id: string) => `onboardings/${id}/financial-pulse` as const,
    ONBOARDING_PRODUCTS: (id: string) => `onboardings/${id}/products` as const,
  },
  AUTH: {
    LOGIN: "auth/login",
    CHECK: "users/",
    PERMISSIONS: "auth/permissions/"
  },
  DEPARTMENT: {
    DEPARTMENTS: "departments/"
  },
  ROLE: {
    ROLES: "roles/"
  },
  USER: {
    USERS: "users/",
    INVITEUSER: "users/invite"
  },
  COMPANY: {
    BULK_IMPORT: "companies/bulk/import",
    COMPANY_DETAILS: (id: string) => `companies/${id}` as const,
  }
} as const;
