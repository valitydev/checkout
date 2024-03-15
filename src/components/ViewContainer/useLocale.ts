import { useCallback, useReducer } from 'react';

import { Locale } from '../../common/contexts';
import { fetchConfig, withRetry } from '../../common/utils';

type State =
    | { status: 'PRISTINE' }
    | { status: 'LOADING' }
    | { status: 'SUCCESS'; data: Locale }
    | { status: 'FAILURE' };

type Action = { type: 'LOAD_STARTED' } | { type: 'LOAD_SUCCESS'; payload: Locale } | { type: 'LOAD_FAILURE' };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'LOAD_STARTED':
            return {
                ...state,
                status: 'LOADING',
            };
        case 'LOAD_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
                data: action.payload,
            };
        case 'LOAD_FAILURE':
            return {
                ...state,
                status: 'FAILURE',
            };
        default:
            return state;
    }
};

export const useLocale = () => {
    const [localeState, dispatch] = useReducer(dataReducer, {
        status: 'PRISTINE',
    });

    const loadLocale = useCallback((localeCode: string) => {
        (async () => {
            dispatch({ type: 'LOAD_STARTED' });
            try {
                const fetchLocale = withRetry(fetchConfig<Locale>);
                const payload = await fetchLocale(`./assets/locale/${localeCode}.json`);
                dispatch({
                    type: 'LOAD_SUCCESS',
                    payload,
                });
            } catch (ex) {
                dispatch({
                    type: 'LOAD_FAILURE',
                });
            }
        })();
    }, []);

    return { localeState, loadLocale };
};
