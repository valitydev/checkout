import { useCallback, useReducer } from 'react';

import { InitParams } from '../../common/init';
import { initPaymentCondition, PaymentCondition } from '../../common/paymentCondition';
import { initPaymentModel, PaymentModel } from '../../common/paymentModel';
import { extractError } from '../../common/utils';

type ModelsStateData = {
    paymentModel: PaymentModel;
    conditions: PaymentCondition[];
};

type ModelsState =
    | { status: 'PROCESSING' }
    | { status: 'INITIALIZED'; data: ModelsStateData }
    | { status: 'FAILURE'; error: unknown };

type Action =
    | { type: 'INIT_STARTED' }
    | { type: 'INIT_SUCCESS'; payload: ModelsStateData }
    | { type: 'INIT_FAILED'; error: unknown };

const dataReducer = (state: ModelsState, action: Action): ModelsState => {
    switch (action.type) {
        case 'INIT_STARTED':
            return {
                ...state,
                status: 'PROCESSING',
            };
        case 'INIT_SUCCESS':
            return {
                ...state,
                status: 'INITIALIZED',
                data: action.payload,
            };
        case 'INIT_FAILED':
            return {
                ...state,
                status: 'FAILURE',
                error: action.error,
            };
        default:
            return state;
    }
};

export const useInitModels = () => {
    const [modelsState, dispatch] = useReducer(dataReducer, {
        status: 'PROCESSING',
    });

    const init = useCallback((initParams: InitParams) => {
        (async () => {
            dispatch({ type: 'INIT_STARTED' });
            try {
                const paymentModel = await initPaymentModel(initParams);
                const conditions = await initPaymentCondition(paymentModel);
                dispatch({
                    type: 'INIT_SUCCESS',
                    payload: { paymentModel, conditions },
                });
            } catch (error) {
                console.error(`useInitModels error. ${extractError(error)}`);
                dispatch({ type: 'INIT_FAILED', error });
            }
        })();
    }, []);

    return { modelsState, init };
};
