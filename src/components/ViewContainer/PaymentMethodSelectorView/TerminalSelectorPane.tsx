import { useContext } from 'react';

import { ViewModelContext } from '../../../common/contexts';
import { Method, PaymentMethodIcon, PaymentMethodTitle } from '../../legacy';

export type TerminalSelectorPaneProps = {
    destinationViewId: string;
};

export function TerminalSelectorPane({ destinationViewId }: TerminalSelectorPaneProps) {
    const {
        goTo,
        viewModel: { views },
    } = useContext(ViewModelContext);

    const destination = views.get(destinationViewId);

    if (destination.name !== 'TerminalSelectorView') {
        throw new Error(`Wrong View. Expected: TerminalSelectorView, actual: ${destination.name}`);
    }

    return (
        <Method onClick={() => goTo(destinationViewId)}>
            <PaymentMethodIcon name="terminals" />
            <PaymentMethodTitle>{destination.category}</PaymentMethodTitle>
        </Method>
    );
}
