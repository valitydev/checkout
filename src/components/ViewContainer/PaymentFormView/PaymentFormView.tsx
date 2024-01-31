import { useContext } from 'react';

import { CardForm } from './CardForm';
import { MetadataForm } from './MetadataForm';
import { ViewModelContext } from '../ViewModelContext';

export function PaymentFormView() {
    const { viewModel } = useContext(ViewModelContext);
    const view = viewModel.views.get(viewModel.activeView);

    if (view.name !== 'PaymentFormView') {
        throw new Error(`Wrong View. Expected: PaymentFormView, actual: ${view.name}`);
    }

    const paymentMethod = view.paymentMethod;

    return (
        <>
            {paymentMethod.methodName === 'BankCard' && <CardForm paymentMethod={paymentMethod} />}
            {paymentMethod.methodName === 'PaymentTerminal' && <MetadataForm paymentMethod={paymentMethod} />}
        </>
    );
}
