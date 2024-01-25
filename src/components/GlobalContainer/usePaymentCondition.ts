import { useCallback, useReducer } from 'react';

import { PaymentCondition, PaymentProcessed, PaymentUninitialized } from '../../common/paymentCondition';
import { PaymentModel, StartPaymentPayload } from '../../common/paymentModel';
import { delay } from '../../common/utils';

type Action =
    | { type: 'SET_UNINITIALIZED'; payload: PaymentUninitialized }
    | { type: 'SET_PROCESSED'; payload: PaymentProcessed };

const dataReducer = (state: PaymentCondition, action: Action): PaymentCondition => {
    switch (action.type) {
        case 'SET_UNINITIALIZED':
        case 'SET_PROCESSED':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

const toPaymentCondition = (model: PaymentModel): PaymentCondition => {
    return { name: 'uninitialized' };
};

export const usePaymentCondition = (model: PaymentModel) => {
    const [paymentCondition, dispatch] = useReducer(dataReducer, toPaymentCondition(model));

    const startPayment = useCallback((payload: StartPaymentPayload) => {
        (async () => {
            await delay(3000);
            const payload: PaymentCondition = {
                name: 'processed',
            };
            dispatch({ type: 'SET_PROCESSED', payload });
        })();
    }, []);

    return { paymentCondition, startPayment };
};
