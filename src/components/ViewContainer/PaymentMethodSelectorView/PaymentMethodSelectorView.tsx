import { VStack, Text, SimpleGrid } from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext, ViewModelContext } from 'checkout/contexts';

import { BankCardPane } from './BankCardPane';
import { PaymentTerminalPane } from './PaymentTerminalPane';
import { TerminalSelectorPane } from './TerminalSelectorPane';

export function PaymentMethodSelectorView() {
    const { l } = useContext(LocaleContext);
    const {
        viewModel: { views, activeViewId },
        forward,
    } = useContext(ViewModelContext);
    const view = views.get(activeViewId);

    if (view.name !== 'PaymentMethodSelectorView') {
        throw new Error(`Wrong View. Expected: PaymentMethodSelectorView, actual: ${view.name}`);
    }

    return (
        <VStack align="stretch" minH="sm" spacing={5}>
            <Text fontWeight="medium" textAlign="center">
                {l['form.header.payment.methods.label']}
            </Text>
            <SimpleGrid columns={[1, 2, 2]} spacing={5}>
                {view.items.map(({ name, viewId, provider, category }, key) => {
                    switch (name) {
                        case 'BankCard':
                            return <BankCardPane key={key} onClick={() => forward(viewId)} />;
                        case 'PaymentTerminal':
                            return (
                                <PaymentTerminalPane key={key} provider={provider} onClick={() => forward(viewId)} />
                            );
                        case 'TerminalSelector':
                            return (
                                <TerminalSelectorPane key={key} category={category} onClick={() => forward(viewId)} />
                            );
                    }
                })}
            </SimpleGrid>
        </VStack>
    );
}
