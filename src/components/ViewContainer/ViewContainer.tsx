import { Box, Flex, useTheme } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';

import { LocaleContext, PaymentConditionsContext, PaymentModelContext, ViewModelContext } from 'checkout/contexts';
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
    const { localeCode, changeLocale } = useContext(LocaleContext);
    const { viewModel, goTo, forward, backward } = useViewModel(paymentMethods, conditions);
    const viewAmount = useMemo(() => formatAmount(paymentAmount, localeCode), [localeCode]);
    const { views, activeViewId, isLoading } = viewModel;
    const activeView = views.get(activeViewId).name;

    const {
        ViewContainer: { mainContainerBg, viewContainerBg },
    } = useTheme();

    return (
        <>
            <Flex
                alignItems="stretch"
                backgroundColor={mainContainerBg}
                borderRadius="2xl"
                direction={['column', 'column', 'row']}
                gap={4}
                p={[4, 4, 6]}
            >
                <InfoContainer viewAmount={viewAmount}></InfoContainer>
                <ViewModelContext.Provider value={{ viewModel, viewAmount, goTo, forward, backward }}>
                    <Box
                        backgroundColor={viewContainerBg}
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
            <Box paddingLeft="5" paddingRight="5" paddingTop="3">
                <LocaleSelector initLocaleCode={localeCode} onLocaleChange={changeLocale} />
            </Box>
        </>
    );
}
