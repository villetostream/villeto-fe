import { create } from 'zustand';
import { getCookie, setCookie } from '@/lib/cookies';

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

// Load initial state from cookies
const loadFromCookies = (): OnboardingState => {
    const cookieData = getCookie<OnboardingState>('onboarding_financial');
    return cookieData ? { ...initialState, ...cookieData } : initialState;
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set, get) => ({
    ...loadFromCookies(),

    setCurrentStep: (step: number) => {
        set({ currentStep: step });
        const state = get();
        setCookie('onboarding_financial', {
            currentStep: state.currentStep,
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
        });
    },

    setMonthlySpend: (spend: number) => {
        const ranges = ['<$10k', '$10k-$50k', '$50k-$200k', '$200k+'];
        set({ monthlySpend: spend, spendRange: ranges[spend] });
        const state = get();
        setCookie('onboarding_financial', {
            currentStep: state.currentStep,
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
        });
    },

    setSpendRange: (range: string) => {
        set({ spendRange: range });
        const state = get();
        setCookie('onboarding_financial', {
            currentStep: state.currentStep,
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
        });
    },

    setBankConnected: (connected: boolean) => {
        set({ bankConnected: connected });
        const state = get();
        setCookie('onboarding_financial', {
            currentStep: state.currentStep,
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
        });
    },

    setBankProcessing: (processing: boolean) => {
        set({ bankProcessing: processing });
        const state = get();
        setCookie('onboarding_financial', {
            currentStep: state.currentStep,
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
        });
    },

    addConnectedAccount: (account: ConnectedAccount) => {
        set((state) => ({
            connectedAccounts: [...state.connectedAccounts, account]
        }));
        const state = get();
        setCookie('onboarding_financial', {
            currentStep: state.currentStep,
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
        });
    },

    removeConnectedAccount: (id: string) => {
        set((state) => ({
            connectedAccounts: state.connectedAccounts.filter(acc => acc.id !== id)
        }));
        const state = get();
        setCookie('onboarding_financial', {
            currentStep: state.currentStep,
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
        });
    },

    setShowConnectModal: (show: boolean) => {
        set({ showConnectModal: show });
        const state = get();
        setCookie('onboarding_financial', {
            currentStep: state.currentStep,
            monthlySpend: state.monthlySpend,
            spendRange: state.spendRange,
            bankConnected: state.bankConnected,
            bankProcessing: state.bankProcessing,
            connectedAccounts: state.connectedAccounts,
            showConnectModal: state.showConnectModal,
        });
    },

    reset: () => set(initialState),
}));