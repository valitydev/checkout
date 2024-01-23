import { useContext } from 'react';
import styled from 'styled-components';

import { CardForm } from './CardForm';
import { PaymentFormViewModelContext } from './PaymentFormViewModelContext';
import { usePaymentFormViewModel } from './usePaymentFormViewModel';
import { LocaleContext } from '../../../common/contexts';
import { HeaderWrapper, Title } from '../../../components/legacy';
import { ViewModelContext } from '../ViewModelContext';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export function PaymentFormView() {
    const { l } = useContext(LocaleContext);
    const { viewModel, onSetPaymentPayload } = useContext(ViewModelContext);
    const { paymentFormViewModel } = usePaymentFormViewModel(viewModel);

    return (
        <Wrapper>
            <HeaderWrapper>
                <Title>{l['form.header.pay.card.label']}</Title>
            </HeaderWrapper>
            <PaymentFormViewModelContext.Provider value={{ paymentFormViewModel, onSubmitForm: onSetPaymentPayload }}>
                {paymentFormViewModel.name === 'cardForm' && <CardForm />}
            </PaymentFormViewModelContext.Provider>
        </Wrapper>
    );
}
