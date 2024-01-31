import { motion } from 'framer-motion';
import styled from 'styled-components';

import { usePaymentCondition } from './usePaymentCondition';
import { toContainer } from './utils';
import { PaymentContext, PaymentModelContext } from '../../common/contexts';
import { PaymentCondition } from '../../common/paymentCondition';
import { PaymentModel } from '../../common/paymentModel';
import { RedirectContainer } from '../RedirectContainer';
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
    const container = toContainer(paymentCondition);

    return (
        <PaymentModelContext.Provider value={{ paymentModel }}>
            <PaymentContext.Provider value={{ paymentCondition, startPayment }}>
                <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }}>
                    <Wrapper>
                        {container.name === 'ViewContainer' && <ViewContainer />}
                        {container.name === 'RedirectContainer' && <RedirectContainer />}
                    </Wrapper>
                </motion.div>
            </PaymentContext.Provider>
        </PaymentModelContext.Provider>
    );
}
