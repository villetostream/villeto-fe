import z from "zod";

export const emailSchema = z.object({
    email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
})

export const registrationSchema = z.object({
    contactFirstName: z.string().min(1, "First name is required").max(100),
    contactLastName: z.string().min(1, "Last name is required").max(100),
    companyName: z.string().min(1, "Company name is required").max(200),
    accountType: z.enum(["demo", "enterprise"] as const, {
        error: "Please select an account type",
    }),
    contactEmail: z.string()
});


export const onboardingBusinessSchema = z.object({
    business_name: z.string().min(1, "Company name is required").min(2, "Must be at least 2 characters").max(100).optional(),
    // admin_name: z.string().min(1, "Admin name is required").min(2, "Must be at least 2 characters").max(100).regex(/^[A-Za-z\s]+$/, "Only letters and spaces allowed"),
    // admin_email: z.string().min(1, "Email is required").email("Invalid email address"),
    // password: z.string().min(1, "Password is required").min(12, "Password must be at least 12 characters"),
    contactPhone: z.string().min(1, "Contact number is required").min(12, "Contact number must be at least 12 characters"),
    countryOfRegistration: z.string().min(1, "Please select a country"),
    // currency: z.string().min(1, "Please select a currency"),
    websiteUrl: z.httpUrl().optional(),
});

// Base schema with common fields
const baseSchema = z.object({
    firstName: z.string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
    lastName: z.string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),

    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    role: z.string()
        .min(1, "Role is required")
        .min(2, "Role must be at least 2 characters")
        .max(50, "Role must be less than 50 characters"),
});

// Beneficial owner schema
const beneficialOwnerSchema = baseSchema.extend({

    ownershipPercentage: z.number()
        .min(0, "Ownership cannot be negative")
        .max(25, "Ownership cannot exceed 25%"),

    position: z.string().optional()
});

// Officer schema
const officerSchema = baseSchema.extend({
    ownershipPercentage: z.union([
        z.number()
            .min(0, "Ownership cannot be negative")
            .max(100, "Ownership cannot exceed 100%"),
        z.undefined()
    ]).optional(),

});

// Function to get the appropriate schema
export const getFormSchema = (mode: "beneficial" | "officer", isOwner?: boolean) => {
    const isBeneficialOwner = mode === "beneficial" || isOwner;
    return isBeneficialOwner ? beneficialOwnerSchema : officerSchema;
};

// Type inference
export type BeneficialOwnerFormData = z.infer<typeof beneficialOwnerSchema>;
export type OfficerFormData = z.infer<typeof officerSchema>;
export type LeadershipFormData = BeneficialOwnerFormData | OfficerFormData;


export const loginSchema = z.object({
    email: z.email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must be less than 100 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});