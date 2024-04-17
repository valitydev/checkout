import { View } from '../../types';

export const getPaymentFormViewId = (views: Map<string, View>): string | null => {
    for (const view of views.values()) {
        if (view.name === 'PaymentFormView') {
            return view.id;
        }
    }
    return null;
};
