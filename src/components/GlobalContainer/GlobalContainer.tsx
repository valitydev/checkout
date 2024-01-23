import { motion } from 'framer-motion';
import { useCallback } from 'react';
import styled from 'styled-components';

import { toContainer } from './utils';
import { PaymentModelContext } from '../../common/contexts';
import { PaymentModel } from '../../common/hooks';
import { ViewContainer } from '../ViewContainer';

const Wrapper = styled.div`
    height: 100%;
    position: relative;
`;

export type GlobalContainerProps = {
    initPaymentModel: PaymentModel;
};

export function GlobalContainer({ initPaymentModel }: GlobalContainerProps) {
    const container = toContainer(initPaymentModel);

    const startPayment = useCallback((payload: any) => {
        console.log('startPayment', payload);
    }, []);

    return (
        <PaymentModelContext.Provider value={{ model: initPaymentModel, startPayment }}>
            <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }}>
                <Wrapper>
                    {container.name === 'viewContainer' && <ViewContainer />}
                    {container.name === 'thirdPartyContainer' && <div>thirdPartyContainer</div>}
                </Wrapper>
            </motion.div>
        </PaymentModelContext.Provider>
    );
}
