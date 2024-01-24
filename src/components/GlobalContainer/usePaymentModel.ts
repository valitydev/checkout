import { useCallback, useReducer } from 'react';

import { PaymentModel, PaymentState, StartPaymentPayload } from '../../common/paymentModel';
import { delay } from '../../common/utils';

export type PaymentModelChange =
    | {
          status: 'PRISTINE';
          model: PaymentModel;
      }
    | {
          status: 'PAYMENT_STATE_CHANGED';
          paymentState: PaymentState;
      };

type Action = { type: 'SET_PAYMENT_STATE'; payload: PaymentState };

const dataReducer = (state: PaymentModelChange, action: Action): PaymentModelChange => {
    switch (action.type) {
        case 'SET_PAYMENT_STATE':
            return {
                ...state,
                status: 'PAYMENT_STATE_CHANGED',
                paymentState: {
                    ...action.payload,
                },
            };
        default:
            return state;
    }
};

export const usePaymentModel = (initModel: PaymentModel) => {
    const [paymentModelChange, dispatch] = useReducer(dataReducer, { status: 'PRISTINE', model: initModel });

    const startPayment = useCallback((payload: StartPaymentPayload) => {
        (async () => {
            await delay(3000);
            const payload: PaymentState = {
                name: 'processed',
            };
            dispatch({ type: 'SET_PAYMENT_STATE', payload });
        })();
    }, []);

    return { paymentModelChange, startPayment };
};
