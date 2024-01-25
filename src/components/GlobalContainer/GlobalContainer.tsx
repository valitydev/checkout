import { motion } from 'framer-motion';
import styled from 'styled-components';

import { usePaymentCondition } from './usePaymentCondition';
import { toContainer } from './utils';
import { PaymentContext } from '../../common/contexts';
import { PaymentModel } from '../../common/paymentModel';
import { ViewContainer } from '../ViewContainer';

const Wrapper = styled.div`
    height: 100%;
    position: relative;
`;

export type GlobalContainerProps = {
    paymentModel: PaymentModel;
};

export function GlobalContainer({ paymentModel }: GlobalContainerProps) {
    const { paymentCondition, startPayment } = usePaymentCondition(paymentModel);
    const container = toContainer(paymentCondition);

    return (
        <PaymentContext.Provider value={{ paymentModel, paymentCondition, startPayment }}>
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }}>
                <Wrapper>
                    {container.name === 'ViewContainer' && <ViewContainer />}
                    {container.name === 'ThirdPartyContainer' && <div>thirdPartyContainer</div>}
                </Wrapper>
            </motion.div>
        </PaymentContext.Provider>
    );
}
