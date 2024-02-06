import { useContext } from 'react';

import { LocaleContext, ViewModelContext } from '../../../common/contexts';
import { Method, PaymentMethodIcon, PaymentMethodTitle } from '../../legacy';

export type BankCardPaneProps = {
    destinationViewId: string;
};

export function BankCardPane({ destinationViewId }: BankCardPaneProps) {
    const { l } = useContext(LocaleContext);
    const {
        goTo,
        viewModel: { views },
    } = useContext(ViewModelContext);

    const destination = views.get(destinationViewId);

    if (destination.name !== 'PaymentFormView') {
        throw new Error(`Wrong View. Expected: PaymentFormView, actual: ${destination.name}`);
    }

    return (
        <Method onClick={() => goTo(destinationViewId)}>
            <PaymentMethodIcon name="bank-card" />
            <PaymentMethodTitle>{l['form.payment.method.name.card.label']}</PaymentMethodTitle>
        </Method>
    );
}
