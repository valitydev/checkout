export type PaymentFormView = {
    name: 'paymentFormView';
};

export type PaymentMethodSelectorView = {
    name: 'paymentMethodSelectorView';
};

export type PaymentResultView = {
    name: 'paymentResultView';
};

export type QRCodeView = {
    name: 'qrCodeView';
};

export type ViewAmount = string;
export type ViewName = string;
export type SlideAnimationDirection = 'forward' | 'backward';
export type View = QRCodeView | PaymentResultView | PaymentMethodSelectorView | PaymentFormView;

export type ViewModel = {
    activeView: View;
    direction: SlideAnimationDirection;
    isLoading: boolean;
    viewAmount: ViewAmount;
    views: View[];
};
