import { KnownProviderCategory, PaymentMethod, PaymentMethodName } from '../../common/paymentModel';

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

export type TerminalSelectorView = {
    id: string;
    name: 'TerminalSelectorView';
    category: KnownProviderCategory;
    providers: string[];
};

export type PaymentMethodSelectorView = {
    id: string;
    name: 'PaymentMethodSelectorView';
    paymentMethods: PaymentMethod[];
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

export type ViewAmount = string;
export type SlideAnimationDirection = 'forward' | 'backward' | 'none';
export type View =
    | ApiExtensionView
    | QRCodeView
    | PaymentResultView
    | PaymentMethodSelectorView
    | PaymentFormView
    | TerminalSelectorView
    | NoAvailablePaymentMethodsView;

export type ViewModel = {
    direction: SlideAnimationDirection;
    isLoading: boolean;
    views: Map<string, View>;
    activeViewId: string;
    previousViewId: string | null;
};
