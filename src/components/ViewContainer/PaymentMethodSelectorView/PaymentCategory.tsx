import { useContext, useMemo } from 'react';

import { ViewModelContext } from '../../../common/contexts';
import { Method, PaymentMethodIcon, PaymentMethodTitle } from '../../../components/legacy';

export type PaymentCategoryProps = {
    category: string;
};

export function PaymentCategory({ category }: PaymentCategoryProps) {
    const {
        goTo,
        viewModel: { views },
    } = useContext(ViewModelContext);

    const viewId = useMemo(() => {
        for (const view of views.values()) {
            if (view.name === 'TerminalSelectorView' && view.category === category) {
                return view.id;
            }
        }
    }, [views]);

    return (
        <Method onClick={() => goTo(viewId)}>
            <PaymentMethodIcon name="terminals" />
            <PaymentMethodTitle>{category}</PaymentMethodTitle>
        </Method>
    );
}
