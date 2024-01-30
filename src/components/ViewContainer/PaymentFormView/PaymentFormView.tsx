import { useCallback, useContext } from 'react';

import { CardForm } from './CardForm';
import { MetadataForm } from './MetadataForm';
import { toPaymentFormModel } from './toPaymentFormModel';
import { SubmitFormValues } from './types';
import { PaymentPayload } from '../types';
import { ViewModelContext } from '../ViewModelContext';

const toPaymentPayload = (data: SubmitFormValues): PaymentPayload => {
    switch (data.formName) {
        case 'CardForm':
            return {
                methodName: 'BankCard',
                values: data.values,
            };
        case 'MetadataForm':
            return {
                methodName: 'PaymentTerminal',
                values: data.values,
            };
    }
};

export function PaymentFormView() {
    const { viewModel, onSetPaymentPayload } = useContext(ViewModelContext);
    const formModel = toPaymentFormModel(viewModel);

    const onSubmitForm = useCallback((data: SubmitFormValues) => {
        onSetPaymentPayload(toPaymentPayload(data));
    }, []);

    return (
        <>
            {formModel.name === 'CardForm' && <CardForm formModel={formModel} onSubmitForm={onSubmitForm} />}
            {formModel.name === 'MetadataForm' && <MetadataForm formModel={formModel} onSubmitForm={onSubmitForm} />}
        </>
    );
}
