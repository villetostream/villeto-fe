import { create } from 'zustand';
import { getCookie, setCookie, clearOnboardingCookies } from '@/lib/cookies';

export interface UserProfile {
    id: string;
    name: string;
    role: string;
    percentage?: number;
    avatar: string;
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
}

export interface OnboardingState {
    monthlySpend: number;
    spendRange: string;
    bankConnected: boolean;
    bankProcessing: boolean;
    connectedAccounts: ConnectedAccount[];
    showConnectModal: boolean;
    businessSnapshot: BusinessSnapshot;
    userProfiles: UserProfile[];
    financialPulse: FinancialPulse;
    villetoProducts: VilletoProduct[];
}

interface VilletoState {
    currentStep: number;

    showCongratulations: boolean;


    // Actions
    setCurrentStep: (step: number) => void;
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
    monthlySpend: 1, // 0-3 representing the spend ranges
    spendRange: '<$10k',
    bankConnected: false,
    bankProcessing: false,
    connectedAccounts: [],
    showConnectModal: false,
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
        { id: '1', name: 'Corporate Cards', color: 'bg-purple-100 text-purple-700', selected: false },
        { id: '2', name: 'Expense Management', color: 'bg-green-100 text-green-700', selected: false },
        { id: '3', name: 'Vendor Payments', color: 'bg-blue-100 text-blue-700', selected: false },
        { id: '4', name: 'Payroll Automation', color: 'bg-pink-100 text-pink-700', selected: false },
        { id: '5', name: 'Accounts Payable/Receivable', color: 'bg-pink-100 text-pink-700', selected: false },
    ],
};

// Load initial state from cookies
const loadFromCookies = (): Partial<OnboardingState> => {
    const businessData = getCookie('onboarding_business');
    const leadershipData = getCookie('onboarding_leadership');
    const financialData = getCookie('onboarding_financial');
    const productsData = getCookie('onboarding_products');

    return {
        ...(businessData && { businessSnapshot: businessData.businessSnapshot }),
        ...(leadershipData && { userProfiles: leadershipData.userProfiles }),
        ...(financialData && {
            monthlySpend: financialData.monthlySpend,
            spendRange: financialData.spendRange,
            bankConnected: financialData.bankConnected,
            bankProcessing: financialData.bankProcessing,
            connectedAccounts: financialData.connectedAccounts,
            showConnectModal: financialData.showConnectModal,
            financialPulse: financialData.financialPulse
        }),
        ...(productsData && { villetoProducts: productsData.villetoProducts }),
    };
};

export const useOnboardingStore = create<VilletoState & OnboardingState>((set, get) => ({
    currentStep: 5, // Starting at Choose Products for demo
    ...initialState,
    ...loadFromCookies(),
    showCongratulations: false,

    setCurrentStep: (step) => set({ currentStep: step }),

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
    reset: () => set(initialState)
}));