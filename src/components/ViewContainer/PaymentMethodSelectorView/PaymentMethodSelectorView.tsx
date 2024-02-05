import { useContext } from 'react';
import styled from 'styled-components';

import { BankCard } from './BankCard';
import { PaymentCategory } from './PaymentCategory';
import { PaymentTerminal } from './PaymentTerminal';
import { LocaleContext, ViewModelContext } from '../../../common/contexts';
import { HeaderWrapper, Title } from '../../../components/legacy';

const MethodList = styled.div`
    display: flex;
    flex-direction: column;
`;

export function PaymentMethodSelectorView() {
    const { l } = useContext(LocaleContext);
    const {
        viewModel: { views, activeViewId },
    } = useContext(ViewModelContext);
    const view = views.get(activeViewId);

    if (view.name !== 'PaymentMethodSelectorView') {
        throw new Error(`Wrong View. Expected: PaymentMethodSelectorView, actual: ${view.name}`);
    }

    return (
        <>
            <HeaderWrapper>
                <Title>{l['form.header.payment.methods.label']}</Title>
            </HeaderWrapper>
            <MethodList>
                {view.paymentMethods.map((method, key) => {
                    switch (method.methodName) {
                        case 'BankCard':
                            return <BankCard key={key} />;
                        case 'PaymentTerminal':
                            const { providers, category } = method;
                            if (providers.length === 1) {
                                return <PaymentTerminal key={key} provider={providers[0]} />;
                            }
                            return <PaymentCategory key={key} category={category} />;
                    }
                })}
            </MethodList>
        </>
    );
}
