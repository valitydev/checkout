import { KnownProviderCategory, PaymentMethodName } from '../../common/paymentModel';

export type ViewName =
    | 'PaymentFormView'
    | 'PaymentMethodSelectorView'
    | 'PaymentResultView'
    | 'QrCodeView'
    | 'TerminalSelectorView'
    | 'ApiExtensionView'
    | 'NoAvailablePaymentMethodsView';

export type PaymentFormView = {
    id: string;
    name: 'PaymentFormView';
    methodName: PaymentMethodName;
    provider?: string;
};

export type TerminalSelectorItem = {
    provider: string;
    viewId: string;
};

export type TerminalSelectorView = {
    id: string;
    name: 'TerminalSelectorView';
    category: KnownProviderCategory;
    items: TerminalSelectorItem[];
};

export type PaymentMethodSelectorItem = {
    name: PaymentMethodName | 'TerminalSelector';
    viewId: string;
    category?: string;
    provider?: string;
};

export type PaymentMethodSelectorView = {
    id: string;
    name: 'PaymentMethodSelectorView';
    items: PaymentMethodSelectorItem[];
};

export type PaymentResultView = {
    id: string;
    name: 'PaymentResultView';
};

export type QRCodeView = {
    id: string;
    name: 'QrCodeView';
};

export type ApiExtensionView = {
    id: string;
    name: 'ApiExtensionView';
};

export type NoAvailablePaymentMethodsView = {
    id: string;
    name: 'NoAvailablePaymentMethodsView';
};

export type PaymentProcessFailedView = {
    id: string;
    name: 'PaymentProcessFailedView';
};

export type ViewAmount = string;
export type SlideAnimationDirection = 'forward' | 'backward' | 'none';
export type View =
    | ApiExtensionView
    | QRCodeView
    | PaymentResultView
    | PaymentMethodSelectorView
    | TerminalSelectorView
    | PaymentFormView
    | NoAvailablePaymentMethodsView
    | PaymentProcessFailedView;

export type ViewModel = {
    direction: SlideAnimationDirection;
    isLoading: boolean;
    views: Map<string, View>;
    activeViewId: string;
    history: string[];
    hasBackward: boolean;
};
