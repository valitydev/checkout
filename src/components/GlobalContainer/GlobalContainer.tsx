import { Box } from '@chakra-ui/react';

import { PaymentConditionsContext, PaymentContext, PaymentModelContext } from 'checkout/contexts';
import { PaymentCondition } from 'checkout/paymentCondition';
import { PaymentModel } from 'checkout/paymentModel';

import { usePaymentCondition } from './usePaymentCondition';
import { usePostMessage } from './usePostMessage';
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

    usePostMessage(conditions);

    return (
        <PaymentModelContext.Provider value={{ paymentModel }}>
            <PaymentConditionsContext.Provider value={{ conditions }}>
                <PaymentContext.Provider value={{ startPayment, startWaitingPaymentResult }}>
                    <Box my={[10, 10, 16]} width={['full', '75%', 'auto']}>
                        {containerName === 'ViewContainer' && <ViewContainer />}
                        {containerName === 'RedirectContainer' && <RedirectContainer />}
                    </Box>
                </PaymentContext.Provider>
            </PaymentConditionsContext.Provider>
        </PaymentModelContext.Provider>
    );
}

export default GlobalContainer;
