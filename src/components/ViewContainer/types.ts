import { StartPaymentPayload } from '../../common/paymentMgmt';
import { InitContextContactInfo, PaymentMethod } from '../../common/paymentModel';

export type ViewName =
    | 'PaymentFormView'
    | 'PaymentMethodSelectorView'
    | 'PaymentResultView'
    | 'QrCodeView'
    | 'TerminalSelectorView';

export type PaymentFormViewPaymentMethod = PaymentMethod;
export type PaymentFormViewInitContext = {
    contactInfo?: InitContextContactInfo;
    terminalFormValues?: object;
};

export type PaymentFormView = {
    name: 'PaymentFormView';
    paymentMethod: PaymentFormViewPaymentMethod;
    initContext: PaymentFormViewInitContext;
};

export type TerminalSelectorView = {
    name: 'TerminalSelectorView';
    paymentMethod: PaymentFormViewPaymentMethod;
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

export type ViewAmount = string;
export type SlideAnimationDirection = 'forward' | 'backward';
export type View = QRCodeView | PaymentResultView | PaymentMethodSelectorView | PaymentFormView | TerminalSelectorView;

export type ViewModel = {
    direction: SlideAnimationDirection;
    isLoading: boolean;
    viewAmount: ViewAmount;
    views: Map<ViewName, View>;
    activeView?: ViewName;
};

export type PaymentPayload = StartPaymentPayload;
