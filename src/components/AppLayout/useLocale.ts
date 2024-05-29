import { useCallback, useEffect, useReducer } from 'react';

import { Locale } from 'checkout/contexts';
import { extractError, fetchConfig, withRetry } from 'checkout/utils';

type State = { status: 'PRISTINE' | 'LOADING' | 'SUCCESS' | 'FAILURE'; localeCode: string; l: Locale };

type Action =
    | { type: 'FETCH_START' }
    | {
          type: 'FETCH_SUCCESS';
          payload: {
              l: Locale;
              localeCode: string;
          };
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
                ...action.payload,
                status: 'SUCCESS',
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

export const useLocale = (initLocaleCode: string) => {
    const [localeState, dispatch] = useReducer(dataReducer, {
        status: 'PRISTINE',
        l: {},
        localeCode: initLocaleCode,
    });

    useEffect(() => {
        changeLocale(initLocaleCode);
    }, [initLocaleCode]);

    useEffect(() => {
        const dir = localeState.localeCode === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', dir);
    }, [localeState.localeCode]);

    const changeLocale = useCallback((localeCode: string) => {
        (async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const fetchLocale = withRetry(fetchConfig<Locale>);
                const l = await fetchLocale(`./assets/locale/${localeCode}.json`);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: { l, localeCode },
                });
            } catch (error) {
                console.error(`Failed to fetch locale: ${extractError(error)}`);
                dispatch({
                    type: 'FETCH_FAILURE',
                });
            }
        })();
    }, []);

    return { localeState, changeLocale };
};
