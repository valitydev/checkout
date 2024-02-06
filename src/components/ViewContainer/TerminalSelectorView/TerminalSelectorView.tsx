import { useContext } from 'react';

import { ServiceProvidersGrid } from './ServiceProvidersGrid';
import { LocaleContext, ViewModelContext } from '../../../common/contexts';
import { HeaderWrapper, Title } from '../../../components/legacy';

export function TerminalSelectorView() {
    const { l } = useContext(LocaleContext);
    const {
        viewModel: { views, activeViewId },
        goTo,
    } = useContext(ViewModelContext);

    const view = views.get(activeViewId);
    if (view.name !== 'TerminalSelectorView') {
        throw new Error(`Wrong View. Expected: PaymentMethodSelectorView, actual: ${view.name}`);
    }

    return (
        <>
            <HeaderWrapper>
                <Title>{l[`form.header.${view.category}.label`]}</Title>
            </HeaderWrapper>
            <ServiceProvidersGrid items={view.items} onPaneClick={goTo} />
        </>
    );
}
