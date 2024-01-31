import { CardFormModel, MetadataFormModel, PaymentFormModel } from './types';
import { PaymentFormView, ViewModel } from '../types';

const toCardFormModel = (viewAmount: string): CardFormModel => ({
    name: 'CardForm',
    formTitle: 'form.header.pay.card.label',
    viewAmount,
});

const toPaymentTerminalModel = ({ paymentMethod }: PaymentFormView, viewAmount: string): MetadataFormModel => {
    if (paymentMethod.name !== 'PaymentTerminal') throw new Error('Wrong view payment method name');
    const providers = paymentMethod.providers;
    if (providers.length > 1) {
        throw new Error('Payment method: PaymentTerminal must contain only one provider.');
    }
    const provider = providers[0];
    return {
        name: 'MetadataForm',
        provider,
        viewAmount,
    };
};

export const toPaymentFormModel = (viewModel: ViewModel): PaymentFormModel => {
    const view = viewModel.views.get(viewModel.activeView);
    if (view.name !== 'PaymentFormView') {
        throw new Error(`Wrong View. Expected: PaymentFormView, actual: ${view.name}`);
    }
    const viewAmount = viewModel.viewAmount;
    switch (view.paymentMethod.name) {
        case 'BankCard':
            return toCardFormModel(viewAmount);
        case 'PaymentTerminal':
            return toPaymentTerminalModel(view, viewAmount);
    }
};
