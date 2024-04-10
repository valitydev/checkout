import { Flex } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';

import {
    CustomizationContext,
    LocaleContext,
    PaymentConditionsContext,
    PaymentModelContext,
    ViewModelContext,
} from 'checkout/contexts';
import { formatAmount } from 'checkout/utils';

import { InfoContainer } from './InfoContainer';
import { useViewModel } from './useViewModel';
import { ViewContainerInner } from './ViewContainerInner';

export function ViewContainer() {
    const { name, description } = useContext(CustomizationContext);
    const { localeCode } = useContext(LocaleContext);
    const { conditions } = useContext(PaymentConditionsContext);
    const {
        paymentModel: { paymentAmount, paymentMethods },
    } = useContext(PaymentModelContext);
    const { viewModel, goTo, forward, backward } = useViewModel(paymentMethods, conditions);

    const viewAmount = useMemo(() => formatAmount(paymentAmount, localeCode), [localeCode]);

    // TODO Padding should be: [4, 4, 8]
    return (
        <Flex
            background="gray.50"
            borderRadius="xl"
            direction={['column', 'column', 'row']}
            gap={[0, 0, 2]}
            p={[0, 0, 8]}
        >
            <InfoContainer description={description} name={name} viewAmount={viewAmount}></InfoContainer>
            <ViewModelContext.Provider value={{ viewModel, viewAmount, goTo, forward, backward }}>
                <ViewContainerInner />
            </ViewModelContext.Provider>
        </Flex>
    );
}
