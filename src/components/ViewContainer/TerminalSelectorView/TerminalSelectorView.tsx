import { Flex, VStack, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { BackwardBox } from 'checkout/components';
import { LocaleContext, ViewModelContext } from 'checkout/contexts';

import { ServiceProvidersGrid } from './ServiceProvidersGrid';

export function TerminalSelectorView() {
    const { l } = useContext(LocaleContext);
    const {
        viewModel: { views, activeViewId, hasBackward },
        backward,
        forward,
    } = useContext(ViewModelContext);

    const view = views.get(activeViewId);
    if (view.name !== 'TerminalSelectorView') {
        throw new Error(`Wrong View. Expected: PaymentMethodSelectorView, actual: ${view.name}`);
    }

    return (
        <VStack align="stretch" spacing={5}>
            <Flex alignItems="center" direction="row">
                {hasBackward && <BackwardBox onClick={backward} />}
                <Text color="bodyText" fontWeight="medium" textAlign="center" width="full">
                    {l[`form.header.${view.category}.label`]}
                </Text>
            </Flex>
            <ServiceProvidersGrid items={view.items} onPaneClick={forward} />
        </VStack>
    );
}
