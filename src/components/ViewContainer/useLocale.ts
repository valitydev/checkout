import { useCallback, useReducer } from 'react';

import { Locale } from 'checkout/contexts';
import { extractError, fetchConfig, withRetry } from 'checkout/utils';

type State =
    | { status: 'PRISTINE' }
    | { status: 'LOADING' }
    | { status: 'SUCCESS'; data: Locale }
    | { status: 'FAILURE' };

type Action =
    | { type: 'FETCH_START' }
    | {
          type: 'FETCH_SUCCESS';
          payload: Locale;
      }
    | { type: 'FETCH_FAILURE' };

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                status: 'LOADING',
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                status: 'SUCCESS',
                data: action.payload,
            };
        case 'FETCH_FAILURE':
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
            dispatch({ type: 'FETCH_START' });
            try {
                const fetchLocale = withRetry(fetchConfig<Locale>);
                const locale = await fetchLocale(`./assets/locale/${localeCode}.json`);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: locale,
                });
            } catch (error) {
                console.error(`Failed to fetch locale: ${extractError(error)}`);
                dispatch({
                    type: 'FETCH_FAILURE',
                });
            }
        })();
    }, []);

    return { localeState, loadLocale };
};
