export type ViewName = 'PaymentFormView' | 'PaymentMethodSelectorView' | 'PaymentResultView' | 'QrCodeView';

export type PaymentFormView = {
    name: 'PaymentFormView';
};

export type PaymentMethodSelectorView = {
    name: 'PaymentMethodSelectorView';
};

export type LocalePath = string;

export type PaymentResultView = {
    name: 'PaymentResultView';
    iconName: 'Success' | 'Warning' | 'Error';
    label: LocalePath;
    description?: LocalePath;
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
    activeView?: View;
};

export type PaymentPayload = Record<string, any>;
