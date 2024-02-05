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
    name: 'PaymentFormView';
    methodName: PaymentMethodName;
    provider?: string;
};

export type TerminalSelectorView = {
    name: 'TerminalSelectorView';
    category: KnownProviderCategory;
    providers: string[];
};

export type PaymentMethodSelectorView = {
    name: 'PaymentMethodSelectorView';
    paymentMethods: PaymentMethod[];
};

export type PaymentResultView = {
    name: 'PaymentResultView';
};

export type QRCodeView = {
    name: 'QrCodeView';
};

export type ApiExtensionView = {
    name: 'ApiExtensionView';
};

export type NoAvailablePaymentMethodsView = {
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
    views: Map<ViewName, View>;
    activeView: ViewName;
};
