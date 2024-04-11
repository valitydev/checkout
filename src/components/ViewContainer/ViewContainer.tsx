/* eslint-disable react/jsx-max-depth */

import { Box, Flex } from '@chakra-ui/react';
import { useContext, useMemo, useState } from 'react';

import {
    Locale,
    LocaleContext,
    PaymentConditionsContext,
    PaymentModelContext,
    ViewModelContext,
} from 'checkout/contexts';
import { formatAmount } from 'checkout/utils';

import { ApiExtensionView } from './ApiExtensionView';
import { InfoContainer } from './InfoContainer';
import { Loader } from './Loader';
import { LocaleSelector } from './LocaleSelector';
import { NoAvailablePaymentMethodsView } from './NoAvailablePaymentMethodsView';
import { PaymentFormView } from './PaymentFormView';
import { PaymentMethodSelectorView } from './PaymentMethodSelectorView';
import { PaymentProcessFailedView } from './PaymentProcessFailedView';
import { PaymentResultView } from './PaymentResultView';
import { QrCodeView } from './QrCodeView';
import { TerminalSelectorView } from './TerminalSelectorView';
import { useViewModel } from './useViewModel';

export function ViewContainer() {
    const { conditions } = useContext(PaymentConditionsContext);
    const {
        paymentModel: { paymentAmount, paymentMethods },
    } = useContext(PaymentModelContext);
    const { viewModel, goTo, forward, backward } = useViewModel(paymentMethods, conditions);
    const [locale, setLocale] = useState<{ l: Locale; localeCode: string }>({ l: {}, localeCode: 'en' });
    const viewAmount = useMemo(() => formatAmount(paymentAmount, locale.localeCode), [locale.localeCode]);
    const { views, activeViewId, isLoading } = viewModel;
    const activeView = views.get(activeViewId).name;

    return (
        <>
            <LocaleContext.Provider value={locale}>
                <Flex
                    alignItems="stretch"
                    background="gray.50"
                    borderRadius="xl"
                    direction={['column', 'column', 'row']}
                    gap={4}
                    p={[4, 4, 8]}
                >
                    <InfoContainer viewAmount={viewAmount}></InfoContainer>
                    <ViewModelContext.Provider value={{ viewModel, viewAmount, goTo, forward, backward }}>
                        <Box
                            background="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            padding={[4, 4, 6]}
                            position="relative"
                            width={['full', 'full', '420px']}
                        >
                            {activeView === 'NoAvailablePaymentMethodsView' && <NoAvailablePaymentMethodsView />}
                            {activeView === 'PaymentMethodSelectorView' && <PaymentMethodSelectorView />}
                            {activeView === 'TerminalSelectorView' && <TerminalSelectorView />}
                            {activeView === 'PaymentFormView' && <PaymentFormView />}
                            {activeView === 'PaymentResultView' && <PaymentResultView />}
                            {activeView === 'QrCodeView' && <QrCodeView />}
                            {activeView === 'ApiExtensionView' && <ApiExtensionView />}
                            {activeView === 'PaymentProcessFailedView' && <PaymentProcessFailedView />}
                            {isLoading && <Loader />}
                        </Box>
                    </ViewModelContext.Provider>
                </Flex>
            </LocaleContext.Provider>
            <Box paddingLeft="5" paddingRight="5" paddingTop="3">
                <LocaleSelector onLocaleChange={setLocale} />
            </Box>
        </>
    );
}
