/* eslint-disable react/jsx-max-depth */
import { Box } from '@chakra-ui/react';
import { useState } from 'react';

import {
    Locale,
    LocaleContext,
    PaymentConditionsContext,
    PaymentContext,
    PaymentModelContext,
} from 'checkout/contexts';
import { PaymentCondition } from 'checkout/paymentCondition';
import { PaymentModel } from 'checkout/paymentModel';

import { LocaleSelector } from './LocaleSelector';
import { usePaymentCondition } from './usePaymentCondition';
import { toContainer } from './utils';
import { RedirectContainer } from '../RedirectContainer';
import { ViewContainer } from '../ViewContainer';

export type GlobalContainerProps = {
    paymentModel: PaymentModel;
    initConditions: PaymentCondition[];
};

export function GlobalContainer({ paymentModel, initConditions }: GlobalContainerProps) {
    const { conditions, startPayment, startWaitingPaymentResult } = usePaymentCondition(paymentModel, initConditions);
    const containerName = toContainer(conditions);
    const [locale, setLocale] = useState<{ l: Locale; localeCode: string }>({ l: {}, localeCode: 'en' });

    return (
        <PaymentModelContext.Provider value={{ paymentModel }}>
            <PaymentConditionsContext.Provider value={{ conditions }}>
                <PaymentContext.Provider value={{ startPayment, startWaitingPaymentResult }}>
                    <LocaleContext.Provider value={locale}>
                        <Box marginBottom={16} marginTop={16} width={['full', '75%', 'auto']}>
                            {containerName === 'ViewContainer' && <ViewContainer />}
                            {containerName === 'RedirectContainer' && <RedirectContainer />}
                            <Box paddingLeft="5" paddingRight="5" paddingTop="3">
                                <LocaleSelector onLocaleChange={setLocale} />
                            </Box>
                        </Box>
                    </LocaleContext.Provider>
                </PaymentContext.Provider>
            </PaymentConditionsContext.Provider>
        </PaymentModelContext.Provider>
    );
}

export default GlobalContainer;
