import { useMutation } from "@tanstack/react-query";
import { useAxios } from "@/hooks/useAxios";
import { API_KEYS } from "@/lib/constants/apis";

/* ─── Rule Types ──────────────────────────────────────────────────────── */

type RuleEnforcement = "hard_block" | "soft_warning";

export interface SpendLimitRule {
  type: "spend_limit";
  timeframe: "daily" | "weekly" | "monthly" | "per_transaction";
  amount: number;          // numeric — parseFloat before sending
  currency: string;        // ISO 4217: "NGN" | "GHS" | "KES" | "ZAR"
  enforcement: RuleEnforcement;
}

export interface ReceiptRequirementRule {
  type: "receipt_requirement";
  requiredAboveAmount: number;
  currency: string;
  enforcement: RuleEnforcement;
}

// Union — extend with new rule types as they are built
export type PolicyRule = SpendLimitRule | ReceiptRequirementRule;

/* ─── Scope Types ─────────────────────────────────────────────────────── */

export interface PolicyScopeAll {
  type: "all_employees";
}

export interface PolicyScopeSpecific {
  type: "specific";
  departmentIds: string[];
  roleIds: string[];
}

export type PolicyScope = PolicyScopeAll | PolicyScopeSpecific;

/* ─── Approver ────────────────────────────────────────────────────────── */

export interface PolicyApprover {
  userId: string;
  order?: number;   // optional sequential ordering for multi-approver chains
}

/* ─── Main Payload ────────────────────────────────────────────────────── */

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

interface Response {
  data: any;
  error: {
    error: string;
    message?: string;
    success: boolean;
  };
  message: string;
  status: number;
  statusCode: number;
  statusText: string;
}

export const useCreatePolicyApi = () => {
  const axiosInstance = useAxios();

  return useMutation<Response, Error, CreatePolicyPayload>({
    retry: false,
    mutationFn: async (payload: CreatePolicyPayload) => {
      const res = await axiosInstance.post(API_KEYS.EXPENSE.POLICIES, payload);
      return res.data;
    },
  });
};
