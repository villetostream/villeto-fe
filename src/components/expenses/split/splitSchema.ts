import z from "zod";

export const splitExpenseSchema = z.object({
    type: z.enum(["department", "category", "project", "colleagues"]),
    option: z.string().min(1, "Option is required"),
    amount: z.coerce.number<number>().min(0.01, "Amount must be greater than 0"),
});

