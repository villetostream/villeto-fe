import { create } from 'zustand';

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
        businessName: 'XYZ Corporation',
        countryOfRegistration: 'United States of America',
        contactNumber: '+1 256 890 123 45',
        website: 'xyzcorporation.com',
    },
    userProfiles: [
        {
            id: '1',
            name: 'James Doe',
            role: 'Beneficial Owner A',
            percentage: 10,
            avatar: '👨‍💼',
        },
        {
            id: '2',
            name: 'Anita Doe',
            role: 'Beneficial Owner B',
            percentage: 25,
            avatar: '👩‍💼',
        },
        {
            id: '3',
            name: 'James Doe',
            role: 'Chief Executive Officer',
            avatar: '👨‍💼',
        },
    ],
    financialPulse: {
        monthlySpend: '$10k-$50k',
        bankConnection: 'Bank Statement.pdf',
        integrations: ['QuickBooks', 'Xero'],
    },
    villetoProducts: [
        { id: '1', name: 'Corporate Cards', color: 'bg-purple-100 text-purple-700', selected: true },
        { id: '2', name: 'Expense Management', color: 'bg-green-100 text-green-700', selected: false },
        { id: '3', name: 'Vendor Payments', color: 'bg-blue-100 text-blue-700', selected: false },
        { id: '4', name: 'Payroll Automation', color: 'bg-pink-100 text-pink-700', selected: false },
        { id: '5', name: 'Accounts Payable/Receivable', color: 'bg-pink-100 text-pink-700', selected: false },
    ],
};

export const useOnboardingStore = create<VilletoState & OnboardingState>((set) => ({
    currentStep: 5, // Starting at Choose Products for demo
    ...initialState,
    showCongratulations: false,

    setCurrentStep: (step) => set({ currentStep: step }),

    setMonthlySpend: (spend: number) => {
        const ranges = ['<$10k', '$10k-$50k', '$50k-$200k', '$200k+'];
        set({ monthlySpend: spend, spendRange: ranges[spend] });
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

    updateBusinessSnapshot: (data) =>
        set((state) => ({
            businessSnapshot: { ...state.businessSnapshot, ...data },
        })),

    updateUserProfiles: (profiles) => set({ userProfiles: profiles }),

    updateFinancialPulse: (data) =>
        set((state) => ({
            financialPulse: { ...state.financialPulse, ...data },
        })),

    toggleProduct: (productId) =>
        set((state) => ({
            villetoProducts: state.villetoProducts.map((product) =>
                product.id === productId
                    ? { ...product, selected: !product.selected }
                    : product
            ),
        })),

    submitApplication: () => set({ showCongratulations: true }),

    closeCongratulations: () => set({ showCongratulations: false }),
    reset: () => set(initialState)
}));