import { StartPaymentPayload } from '../../common/paymentMgmt';
import { PaymentMethod } from '../../common/paymentModel';

export type ViewName =
    | 'PaymentFormView'
    | 'PaymentMethodSelectorView'
    | 'PaymentResultView'
    | 'QrCodeView'
    | 'TerminalSelectorView'
    | 'ApiExtensionView';

export type PaymentFormView = {
    name: 'PaymentFormView';
    paymentMethod: PaymentMethod;
};

export type TerminalSelectorView = {
    name: 'TerminalSelectorView';
    paymentMethod: PaymentMethod;
};

export type PaymentMethodSelectorView = {
    name: 'PaymentMethodSelectorView';
};

export type LocalePath = string;

export type PaymentResultView = {
    name: 'PaymentResultView';
    iconName: 'Success' | 'Warning' | 'Error';
    label: LocalePath;
    description?: string;
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
    viewAmount: ViewAmount;
    views: Map<ViewName, View>;
    activeView?: ViewName;
};

export type PaymentPayload = StartPaymentPayload;
