import { StartPaymentPayload } from '../../common/paymentMgmt';
import { PaymentMethod } from '../../common/paymentModel';

export type ViewName = 'PaymentFormView' | 'PaymentMethodSelectorView' | 'PaymentResultView' | 'QrCodeView';

export type PaymentFormViewPaymentMethod = PaymentMethod;

export type PaymentFormView = {
    name: 'PaymentFormView';
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
export type View = QRCodeView | PaymentResultView | PaymentMethodSelectorView | PaymentFormView;

export type ViewModel = {
    direction: SlideAnimationDirection;
    isLoading: boolean;
    viewAmount: ViewAmount;
    views: Map<ViewName, View>;
    activeView?: ViewName;
};

export type PaymentPayload = StartPaymentPayload;
