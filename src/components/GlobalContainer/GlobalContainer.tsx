import { motion } from 'framer-motion';
import styled from 'styled-components';

import { usePaymentCondition } from './usePaymentCondition';
import { toContainer } from './utils';
import { PaymentContext } from '../../common/contexts';
import { PaymentCondition } from '../../common/paymentCondition';
import { PaymentModel } from '../../common/paymentModel';
import { SelfRedirectContainer } from '../SelfRedirectContainer';
import { ViewContainer } from '../ViewContainer';

const Wrapper = styled.div`
    height: 100%;
    position: relative;
`;

export type GlobalContainerProps = {
    paymentModel: PaymentModel;
    initPaymentCondition: PaymentCondition;
};

export function GlobalContainer({ paymentModel, initPaymentCondition }: GlobalContainerProps) {
    const { paymentCondition, startPayment } = usePaymentCondition(paymentModel, initPaymentCondition);
    // const { userInteraction, setPaymentCondition } = useActivePaymentProvider(paymentModel);
    const container = toContainer(paymentCondition);

    return (
        <PaymentContext.Provider value={{ paymentModel, paymentCondition, startPayment }}>
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }}>
                <Wrapper>
                    {container.name === 'ViewContainer' && <ViewContainer />}
                    {container.name === 'ThirdPartyContainer' && <div>ThirdPartyContainer</div>}
                    {container.name === 'SelfRedirectContainer' && <SelfRedirectContainer />}
                </Wrapper>
            </motion.div>
        </PaymentContext.Provider>
    );
}
