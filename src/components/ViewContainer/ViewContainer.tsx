/* eslint-disable react/jsx-max-depth */

import { Box, Flex } from '@chakra-ui/react';
import { useContext, useEffect, useMemo, useState } from 'react';

import {
    CustomizationContext,
    LocaleContext,
    PaymentConditionsContext,
    PaymentModelContext,
    ViewModelContext,
} from 'checkout/contexts';
import { formatAmount } from 'checkout/utils';

import { ApiExtensionView } from './ApiExtensionView';
import { InfoContainer } from './InfoContainer';
import { Loader } from './Loader';
import { LocaleObj, LocaleSelector } from './LocaleSelector';
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
    const { initLocaleCode } = useContext(CustomizationContext);
    const { viewModel, goTo, forward, backward } = useViewModel(paymentMethods, conditions);
    const [locale, setLocale] = useState<LocaleObj>({
        l: {},
        localeCode: initLocaleCode,
    });
    const viewAmount = useMemo(() => formatAmount(paymentAmount, locale.localeCode), [locale.localeCode]);
    const { views, activeViewId, isLoading } = viewModel;
    const activeView = views.get(activeViewId).name;

    useEffect(() => {
        const dir = locale.localeCode === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
    }, [locale.localeCode]);

    return (
        <>
            <LocaleContext.Provider value={locale}>
                <Flex
                    alignItems="stretch"
                    background="gray.50"
                    borderRadius="2xl"
                    direction={['column', 'column', 'row']}
                    gap={4}
                    p={[4, 4, 6]}
                >
                    <InfoContainer viewAmount={viewAmount}></InfoContainer>
                    <ViewModelContext.Provider value={{ viewModel, viewAmount, goTo, forward, backward }}>
                        <Box
                            background="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="xl"
                            p={[4, 4, 6]}
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
                <LocaleSelector initLocaleCode={initLocaleCode} onLocaleChange={setLocale} />
            </Box>
        </>
    );
}
