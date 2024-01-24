import { motion } from 'framer-motion';
import styled from 'styled-components';

import { usePaymentModel } from './usePaymentModel';
import { toContainer } from './utils';
import { PaymentModelContext } from '../../common/contexts';
import { PaymentModel } from '../../common/paymentModel';
import { ViewContainer } from '../ViewContainer';

const Wrapper = styled.div`
    height: 100%;
    position: relative;
`;

export type GlobalContainerProps = {
    initPaymentModel: PaymentModel;
};

export function GlobalContainer({ initPaymentModel }: GlobalContainerProps) {
    const { paymentModelChange, startPayment } = usePaymentModel(initPaymentModel);
    const container = toContainer(paymentModelChange);

    return (
        <PaymentModelContext.Provider value={{ initPaymentModel, paymentModelChange, startPayment }}>
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }}>
                <Wrapper>
                    {container.name === 'viewContainer' && <ViewContainer />}
                    {container.name === 'thirdPartyContainer' && <div>thirdPartyContainer</div>}
                </Wrapper>
            </motion.div>
        </PaymentModelContext.Provider>
    );
}
