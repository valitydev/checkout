import { useContext } from 'react';
import styled from 'styled-components';

import { BankCardPane } from './BankCardPane';
import { PaymentTerminalPane } from './PaymentTerminalPane';
import { TerminalSelectorPane } from './TerminalSelectorPane';
import { LocaleContext, ViewModelContext } from '../../../common/contexts';
import { HeaderWrapper, Title } from '../../../components/legacy';

const PanesWrapper = styled.div`
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
            <PanesWrapper>
                {view.items.map(({ name, viewId }, key) => {
                    switch (name) {
                        case 'BankCard':
                            return <BankCardPane key={key} destinationViewId={viewId} />;
                        case 'PaymentTerminal':
                            return <PaymentTerminalPane key={key} destinationViewId={viewId} />;
                        case 'TerminalSelector':
                            return <TerminalSelectorPane key={key} destinationViewId={viewId} />;
                    }
                })}
            </PanesWrapper>
        </>
    );
}
