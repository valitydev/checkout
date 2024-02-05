import { useContext, useMemo } from 'react';

import { LocaleContext, ViewModelContext } from '../../../common/contexts';
import { Method, PaymentMethodIcon, PaymentMethodTitle } from '../../../components/legacy';

export function BankCard() {
    const { l } = useContext(LocaleContext);
    const {
        goTo,
        viewModel: { views },
    } = useContext(ViewModelContext);

    const cardFormId = useMemo(() => {
        for (const view of views.values()) {
            if (view.name === 'PaymentFormView' && view.methodName === 'BankCard') {
                return view.id;
            }
        }
    }, [views]);

    return (
        <Method onClick={() => goTo(cardFormId)}>
            <PaymentMethodIcon name="bank-card" />
            <PaymentMethodTitle>{l['form.payment.method.name.card.label']}</PaymentMethodTitle>
        </Method>
    );
}
