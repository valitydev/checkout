import { useCallback, useReducer } from 'react';

import { PaymentModel } from '../../common/paymentModel';

type Action = { type: 'START_PAYMENT'; payload: any };

const dataReducer = (state: PaymentModel, action: Action): PaymentModel => {
    switch (action.type) {
        case 'START_PAYMENT':
            return {
                ...state,
            };
        default:
            return state;
    }
};

export const usePaymentModel = (initModel: PaymentModel) => {
    const [paymentModel, dispatch] = useReducer(dataReducer, initModel);

    const startPayment = useCallback((payload: any) => {
        console.log('startPayment', payload);
        dispatch({ type: 'START_PAYMENT', payload });
    }, []);

    return { paymentModel, startPayment };
};
