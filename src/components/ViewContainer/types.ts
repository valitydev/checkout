import { PaymentMethodName } from '../../common/paymentModel';

export type ViewName =
    | 'PaymentFormView'
    | 'PaymentMethodSelectorView'
    | 'PaymentResultView'
    | 'QrCodeView'
    | 'TerminalSelectorView'
    | 'ApiExtensionView';

export type PaymentFormView = {
    name: 'PaymentFormView';
    methodName: PaymentMethodName;
    provider?: string;
};

export type TerminalSelectorView = {
    name: 'TerminalSelectorView';
    providers: string[];
};

export type PaymentMethodSelectorView = {
    name: 'PaymentMethodSelectorView';
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

export type ViewAmount = string;
export type SlideAnimationDirection = 'forward' | 'backward';
export type View =
    | ApiExtensionView
    | QRCodeView
    | PaymentResultView
    | PaymentMethodSelectorView
    | PaymentFormView
    | TerminalSelectorView;

export type ViewModel = {
    direction: SlideAnimationDirection;
    isLoading: boolean;
    views: Map<ViewName, View>;
    activeView?: ViewName;
};
