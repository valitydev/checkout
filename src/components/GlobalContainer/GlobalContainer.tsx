import { Box, Flex, Text } from '@chakra-ui/react';

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
        <Box marginBottom={[12, 12, 0]} marginTop={[12, 12, 0]}>
            <PaymentModelContext.Provider value={{ paymentModel }}>
                <PaymentConditionsContext.Provider value={{ conditions }}>
                    <PaymentContext.Provider value={{ startPayment, startWaitingPaymentResult }}>
                        {containerName === 'ViewContainer' && <ViewContainer />}
                        {containerName === 'RedirectContainer' && <RedirectContainer />}
                        <Flex>
                            <Text color="white">GlobalContainer</Text>
                        </Flex>
                    </PaymentContext.Provider>
                </PaymentConditionsContext.Provider>
            </PaymentModelContext.Provider>
        </Box>
    );
}

export default GlobalContainer;
