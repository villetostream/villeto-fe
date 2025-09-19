import Step1QuickSignup from "./steps/Step1QuickSignup";
import Step2CompanyLegal from "./steps/Step2CompanyLegal";
import Step3BeneficialOwners from "./steps/Step3BeneficialOwners";
import Step4BankingFunding from "./steps/Step4BankingFunding";
import Step5Accounting from "./steps/Step5Accounting";
import Step6CardsPolicies from "./steps/Step6CardsPolicies";
import Step7TeamProvisioning from "./steps/Step7TeamProvisioning";
import Step8ReviewSubmit from "./steps/Step8ReviewSubmit";

export const steps = [
    { id: 1, label: "Quick Signup", component: Step1QuickSignup },
    { id: 2, label: "Company Legal", component: Step2CompanyLegal },
    { id: 3, label: "Owners & Signatories", component: Step3BeneficialOwners },
    { id: 4, label: "Banking & Funding", component: Step4BankingFunding },
    { id: 5, label: "Accounting", component: Step5Accounting },
    { id: 6, label: "Cards & Policies", component: Step6CardsPolicies },
    { id: 7, label: "Team", component: Step7TeamProvisioning },
    { id: 8, label: "Review & Submit", component: Step8ReviewSubmit },
];
