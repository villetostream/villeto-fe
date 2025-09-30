import { create } from 'zustand';

export interface ConnectedAccount {
    id: string;
    name: string;
    url: string;
    type: 'quickbook' | 'sage';
}

export interface OnboardingState {
    currentStep: number;
    monthlySpend: number;
    spendRange: string;
    bankConnected: boolean;
    bankProcessing: boolean;
    connectedAccounts: ConnectedAccount[];
    showConnectModal: boolean;
}

export interface OnboardingActions {
    setCurrentStep: (step: number) => void;
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
    currentStep: 4, // Start at Financial Pulse step
    monthlySpend: 1, // 0-3 representing the spend ranges
    spendRange: '<$10k',
    bankConnected: false,
    bankProcessing: false,
    connectedAccounts: [],
    showConnectModal: false,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set) => ({
    ...initialState,

    setCurrentStep: (step: number) => set({ currentStep: step }),

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

    reset: () => set(initialState),
}));