import { motion } from 'framer-motion';

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
                    <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 1 }}>
                        {containerName === 'ViewContainer' && <ViewContainer />}
                        {containerName === 'RedirectContainer' && <RedirectContainer />}
                    </motion.div>
                </PaymentContext.Provider>
            </PaymentConditionsContext.Provider>
        </PaymentModelContext.Provider>
    );
}
