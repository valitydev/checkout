import { useCallback, useContext } from 'react';
import styled from 'styled-components';

import { CardForm } from './CardForm';
import { PaymentFormViewModelContext } from './PaymentFormViewModelContext';
import { SubmitFormValues } from './types';
import { usePaymentFormViewModel } from './usePaymentFormViewModel';
import { LocaleContext } from '../../../common/contexts';
import { HeaderWrapper, Title } from '../../../components/legacy';
import { PaymentPayload } from '../types';
import { ViewModelContext } from '../ViewModelContext';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const toPaymentPayload = (data: SubmitFormValues): PaymentPayload => {
    switch (data.formName) {
        case 'CardForm':
            return {
                methodName: 'BankCard',
                values: data.values,
            };
    }
};

export function PaymentFormView() {
    const { l } = useContext(LocaleContext);
    const { viewModel, onSetPaymentPayload } = useContext(ViewModelContext);
    const { paymentFormViewModel } = usePaymentFormViewModel(viewModel);

    const onSubmitForm = useCallback((data: SubmitFormValues) => {
        onSetPaymentPayload(toPaymentPayload(data));
    }, []);

    return (
        <Wrapper>
            <HeaderWrapper>
                <Title>{l[paymentFormViewModel.formTitle]}</Title>
            </HeaderWrapper>
            <PaymentFormViewModelContext.Provider value={{ paymentFormViewModel, onSubmitForm }}>
                {paymentFormViewModel.name === 'CardForm' && <CardForm />}
            </PaymentFormViewModelContext.Provider>
        </Wrapper>
    );
}
