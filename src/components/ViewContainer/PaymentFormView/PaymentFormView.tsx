import { useContext } from 'react';

import { CardForm } from './CardForm';
import { MetadataForm } from './MetadataForm';
import { ViewModelContext } from '../../../common/contexts';

export function PaymentFormView() {
    const {
        viewModel: { views, activeViewId },
    } = useContext(ViewModelContext);
    const view = views.get(activeViewId);

    if (view.name !== 'PaymentFormView') {
        throw new Error(`Wrong View. Expected: PaymentFormView, actual: ${view.name}`);
    }

    return (
        <>
            {view.methodName === 'BankCard' && <CardForm />}
            {view.methodName === 'PaymentTerminal' && <MetadataForm provider={view.provider} />}
        </>
    );
}
