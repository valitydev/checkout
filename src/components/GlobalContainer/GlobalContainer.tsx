/* eslint-disable react/jsx-max-depth */
import { Box } from '@chakra-ui/react';

import { LocaleSelector } from './LocaleSelector';
import { usePaymentCondition } from './usePaymentCondition';
import { toContainer } from './utils';
import { PaymentConditionsContext, PaymentContext, PaymentModelContext } from '../../common/contexts';
import { PaymentCondition } from '../../common/paymentCondition';
import { PaymentModel } from '../../common/paymentModel';
import { RedirectContainer } from '../RedirectContainer';
import { ViewContainer } from '../ViewContainer';

export type GlobalContainerProps = {
    paymentModel: PaymentModel;
    initConditions: PaymentCondition[];
};

export function GlobalContainer({ paymentModel, initConditions }: GlobalContainerProps) {
    const { conditions, startPayment, startWaitingPaymentResult } = usePaymentCondition(paymentModel, initConditions);
    const containerName = toContainer(conditions);

    return (
        <PaymentModelContext.Provider value={{ paymentModel }}>
            <PaymentConditionsContext.Provider value={{ conditions }}>
                <PaymentContext.Provider value={{ startPayment, startWaitingPaymentResult }}>
                    <Box marginBottom={[12, 12, 0]} marginTop={[12, 12, 0]}>
                        {containerName === 'ViewContainer' && <ViewContainer />}
                        {containerName === 'RedirectContainer' && <RedirectContainer />}
                        <Box paddingLeft="5" paddingRight="5" paddingTop="3">
                            <LocaleSelector />
                        </Box>
                    </Box>
                </PaymentContext.Provider>
            </PaymentConditionsContext.Provider>
        </PaymentModelContext.Provider>
    );
}

export default GlobalContainer;
