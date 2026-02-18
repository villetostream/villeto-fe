import { create } from 'zustand';
import { getCookie, setCookie, clearOnboardingCookies } from '@/lib/cookies';
import z from 'zod';
import { registrationSchema } from '@/lib/schemas/schemas';

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    ownershipPercentage?: number;
    avatar?: string;
}
export interface ConnectedAccount {
    id: string;
    name: string;
    url: string;
    type: 'quickbook' | 'sage';
}
export interface BusinessSnapshot {
    businessName: string;
    countryOfRegistration: string;
    contactNumber: string;
    website: string;
    logo?: string;
}

export interface FinancialPulse {
    monthlySpend: string;
    bankConnection: string;
    integrations: string[];
}

export interface VilletoProduct {
    id: string;
    name: string;
    color: string;
    selected: boolean;
    value: string
}

export interface OnboardingState {
    monthlySpend: number;
    spendRange: string;
    onboardingId: string;
    bankConnected: boolean;
    bankProcessing: boolean;
    connectedAccounts: ConnectedAccount[];
    showConnectModal: boolean;
    businessSnapshot: BusinessSnapshot;
    userProfiles: UserProfile[];
    financialPulse: FinancialPulse;
    villetoProducts: VilletoProduct[];
    contactEmail: string
    preOnboarding?: z.infer<typeof registrationSchema> | null
    isExistingUser: boolean;
    stoppedAtStep: number | null;
}

interface VilletoState {
    currentStep: number;

    showCongratulations: boolean;
    onboardingId: string;
    contactEmail: string;

    // Actions
    setPreOnboarding: (data: z.infer<typeof registrationSchema>) => void;
    setCurrentStep: (step: number) => void;
    setOnboardingId: (step: string) => void;
    setContactEmail: (email: string) => void;
    setIsExistingUser: (value: boolean) => void;
    setStoppedAtStep: (step: number | null) => void;
    updateBusinessSnapshot: (data: Partial<BusinessSnapshot>) => void;
    updateUserProfiles: (profiles: UserProfile[]) => void;
    updateFinancialPulse: (data: Partial<FinancialPulse>) => void;
    toggleProduct: (productId: string) => void;
    submitApplication: () => void;
    closeCongratulations: () => void;
    setMonthlySpend: (spend: number) => void;
    setSpendRange: (range: string) => void;
    setBankConnected: (connected: boolean) => void;
    setBankProcessing: (processing: boolean) => void;
    addConnectedAccount: (account: ConnectedAccount) => void;
    removeConnectedAccount: (id: string) => void;
    setShowConnectModal: (show: boolean) => void;
    reset: () => void;
}

const initialState: OnboardingState = {
    monthlySpend: 0, // 0-3 representing the spend ranges
    onboardingId: "",
    spendRange: '<$10k',
    contactEmail: "",
    preOnboarding: null,
    bankConnected: false,
    bankProcessing: false,
    connectedAccounts: [],
    showConnectModal: false,
    isExistingUser: false,
    stoppedAtStep: null,
    businessSnapshot: {
        businessName: '',
        countryOfRegistration: '',
        contactNumber: '',
        website: '',
    },
    userProfiles: [],
    financialPulse: {
        monthlySpend: '',
        bankConnection: '',
        integrations: [],
    },
    villetoProducts: [
        { id: '1', name: 'Corporate Cards', color: 'bg-purple-100 !border-purple-600 text-purple-700', selected: false, value: "CORPORATE_CARDS" },
        { id: '2', name: 'Expense Management', color: 'bg-green-100 !border-green-600 text-green-700', selected: false, value: "EXPENSE_MANAGEMENT" },
        { id: '3', name: 'Vendor Payments', color: 'bg-blue-100 !border-blue-600 text-blue-700', selected: false, value: "VENDOR_PAYMENTS" },
        { id: '4', name: 'Payroll Automation', color: 'bg-pink-100 border-pink-600 text-pink-700', selected: false, value: "PAYROLL_AUTOMATION" },
        { id: '5', name: 'Accounts Payable/Receivable', color: 'bg-pink-100 border-pink-600 text-pink-700', selected: false, value: "ACCOUNTS_PAYABLE_RECEIVABLE" },
    ],
};

// Load initial state from cookies
const loadFromCookies = (): Partial<OnboardingState> => {
    if (typeof document === "undefined") return {};
    const businessSnapshot = getCookie('onboarding_business');
    const leadershipData = getCookie('onboarding_leadership');
    const financialData = getCookie('onboarding_financial');
    const productsData = getCookie('onboarding_products');
    const preOnboarding = getCookie("preOnboarding");
    const contactEmail = getCookie("contactEmail");
    const onboardingId = getCookie("onboarding_id");
    const isExistingUser = getCookie("isExistingUser");
    const stoppedAtStep = getCookie("stoppedAtStep");

    return {
        // businessSnapshot cookie structure: { businessSnapshot: { businessName, logo, ... } }
        ...(businessSnapshot && { 
            businessSnapshot: businessSnapshot.businessSnapshot || businessSnapshot 
        }),
        ...(leadershipData && { userProfiles: leadershipData.userProfiles }),
        ...(financialData && {
            monthlySpend: financialData.monthlySpend,
            spendRange: financialData.spendRange,
            bankConnected: financialData.bankConnected,
            bankProcessing: financialData.bankProcessing,
            connectedAccounts: financialData.connectedAccounts,
            // showConnectModal: financialData.showConnectModal, // Don't persist modal state
            financialPulse: financialData.financialPulse || initialState.financialPulse
        }),
        ...(productsData && { villetoProducts: productsData.villetoProducts }),
        ...(preOnboarding && { preOnboarding: preOnboarding }),
        ...(contactEmail && { contactEmail: typeof contactEmail === 'string' ? contactEmail : contactEmail?.contactEmail }),
        ...(contactEmail && { contactEmail: typeof contactEmail === 'string' ? contactEmail : contactEmail?.contactEmail }),
        ...(onboardingId && { onboardingId: typeof onboardingId === 'string' ? onboardingId : onboardingId?.onboardingId }),
        ...(isExistingUser && { isExistingUser: isExistingUser === 'true' }),
        ...(stoppedAtStep && { stoppedAtStep: Number(stoppedAtStep) })

    };
};

export const useOnboardingStore = create<VilletoState & OnboardingState>((set, get) => ({
    currentStep: 5, // Starting at Choose Products for demo
    ...initialState,
    ...loadFromCookies(),
    showCongratulations: false,


    setCurrentStep: (step) => set({ currentStep: step }),
    setIsExistingUser: (value) => {
        set({ isExistingUser: value });
        setCookie('isExistingUser', String(value));
    },
    setStoppedAtStep: (step) => {
        set({ stoppedAtStep: step });
        setCookie('stoppedAtStep', String(step));
    },
    setOnboardingId: (step) => {
        set({ onboardingId: step }); const state = get();
        setCookie('onboarding_id', {
            onboardingId: state.onboardingId,
        });
    },
    setContactEmail: (step) => {
        set({ contactEmail: step }); const state = get();
        setCookie('contactEmail', {
            contactEmail: state.contactEmail,
        });
    },
    setPreOnboarding: (step) => {
        set({ preOnboarding: step });
        const state = get();
        setCookie('preOnboarding', {
            preOnboarding: state.preOnboarding,
        });
    },

    setMonthlySpend: (spend: number) => {
        const ranges = ['<$10k', '$10k-$50k', '$50k-$200k', '$200k+'];
        set({ monthlySpend: spend, spendRange: ranges[spend] });
        const state = get();
        setCookie('onboarding_financial', {
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
            financialPulse: state.financialPulse,
        });
    },

    setSpendRange: (range: string) => set({ spendRange: range }),

    setBankConnected: (connected: boolean) => set({ bankConnected: connected }),

    setBankProcessing: (processing: boolean) => set({ bankProcessing: processing }),

    addConnectedAccount: (account: ConnectedAccount) =>
        set((state) => ({
            connectedAccounts: [...state.connectedAccounts, account]
        })),

    removeConnectedAccount: (id: string) =>
        set((state) => ({
            connectedAccounts: state.connectedAccounts.filter(acc => acc.id !== id)
        })),

    setShowConnectModal: (show: boolean) => set({ showConnectModal: show }),

    updateBusinessSnapshot: (data) => {
        set((state) => ({
            businessSnapshot: { ...state.businessSnapshot, ...data },
        }));
        const state = get();
        setCookie('onboarding_business', {
            businessSnapshot: state.businessSnapshot,
        });
    },

    updateUserProfiles: (profiles) => {
        set({ userProfiles: profiles });
        setCookie('onboarding_leadership', {
            userProfiles: profiles,
        });
    },

    updateFinancialPulse: (data) =>
        set((state) => ({
            financialPulse: { ...state.financialPulse, ...data },
        })),

    toggleProduct: (productId) => {
        set((state) => ({
            villetoProducts: state.villetoProducts.map((product) =>
                product.id === productId
                    ? { ...product, selected: !product.selected }
                    : product
            ),
        }));
        const state = get();
        setCookie('onboarding_products', {
            villetoProducts: state.villetoProducts,
        });
    },

    submitApplication: () => {
        set({ showCongratulations: true });
        clearOnboardingCookies();
    },

    closeCongratulations: () => set({ showCongratulations: false }),
    reset: () => { clearOnboardingCookies(); set(initialState) }
}));