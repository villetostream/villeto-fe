export const API_KEYS = {
  SUBSCRIBTION: {
    SUBSCRIBER: "subscription/subscribe",
    PLAN: "subscription/plans",
    FEATURE: "subscription/features",
  },
  BLOCK: {
    BLOCKS: "blocks",
    MY_BLOCKS: "blocks/my-blocks/all",
  },
  UNITS: {
    UNITS: "units",
    MYUNITS: "units/my-units/all",
    // MY_BLOCKS: "blocks/my-blocks/all",
  },
  FACILITY: {
    FACILITIES: "facilities",
    MYFACILITIES: "facilities/my-facilities/all",
    // MY_BLOCKS: "blocks/my-blocks/all",
  },
  WORKORDER: {
    WORKORDERS: "work-orders/work-order/all/",
    // MY_BLOCKS: "blocks/my-blocks/all",
    MYWORKORDERS: "work-orders/my-work-orders/all/",
  },
  STATUE: {
    STATUES: "work-requests/requests/all/statuses",
    // MY_STATUES: "blocks/my-blocks/all",
  },
  VENDOR: {
    VENDORS: "/vendors",
    // MY_STATUES: "blocks/my-blocks/all",
  },
  TECHNICIAN: {
    TECHNICIANS: "/technicians",
    // MY_STATUES: "blocks/my-blocks/all",
  },
  CATEGORY: {
    CATEGORIES: "/assets/category/all",
    // MY_STATUES: "blocks/my-blocks/all",
  },
  SERVICE: {
    SERVICES: "service",
  },
  POWER: {
    POWERCATEGORY: "power-category",
    POWERCHARGES: "power-charges",
  },
  PAYMENT: {
    PAYMENTCATEGORY: "payment-category",
  },
  USER: {
    ALLUSER: "users",
    CREATEUSER: "users/pre-register",
    RESETPASSWORDADMIN: "users/reset-password/admin"
  },
  ROLE: {
    ROLE: "roles",
  },
  BILL: {
    ALLBILLS: "bills",
    MYBILLS: "bills/my-bills/all",
  },
  AUTH: {
    LOGIN: "auth/login",
  },
} as const;
