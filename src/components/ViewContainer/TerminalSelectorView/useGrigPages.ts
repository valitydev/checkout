import { useCallback, useReducer } from 'react';

import {
    CheckoutServiceProviderMetadata,
    METADATA_NAMESPACE,
    ServiceProviderMetadataLogo,
    ServiceProviderMetadata,
} from 'checkout/backend/payments/serviceProviderMetadata';
import { TerminalServiceProvider } from 'checkout/paymentModel';

import { TerminalSelectorItem } from '../types';

type ServiceProviderPage = {
    items: GridItem[];
};

export type GridItem = {
    viewId: string;
    brandName: string;
    logo: ServiceProviderMetadataLogo | null;
};

const toPages = (gridItems: GridItem[], itemsOnPage: number): ServiceProviderPage[] => {
    let result: ServiceProviderPage[] = [];
    let start = 0;
    let end = itemsOnPage;
    let isMorePages = true;
    do {
        const sliced = gridItems.slice(start, end);
        isMorePages = sliced.length !== 0;
        if (isMorePages) {
            start = start + itemsOnPage;
            end = end + itemsOnPage;
            result = [
                ...result,
                {
                    items: sliced,
                },
            ];
        }
    } while (isMorePages);
    return result;
};

type State = {
    pages: ServiceProviderPage[];
    pageItems: GridItem[];
    isNext: boolean;
    isPrevious: boolean;
    page: number;
    totalPages: number;
    itemsOnPage: number;
    allItems: GridItem[];
};

type Action =
    | { type: 'NEXT' }
    | { type: 'PREVIOUS' }
    | {
          type: 'FILTER_PAGES';
          payload: string;
      };

const getMetadata = (
    metadata: ServiceProviderMetadata | null,
    namespace = METADATA_NAMESPACE,
): CheckoutServiceProviderMetadata => metadata?.[namespace] || {};

const mapToGridItem =
    (serviceProviders: TerminalServiceProvider[]) =>
    ({ provider, viewId }: TerminalSelectorItem): GridItem => {
        const { brandName, metadata } = serviceProviders.find(({ id }) => id === provider);
        const { logo } = getMetadata(metadata);
        return {
            viewId,
            brandName,
            logo,
        };
    };

const mapToInitState = (
    serviceProviders: TerminalServiceProvider[],
    terminalSelectorItems: TerminalSelectorItem[],
    itemsOnPage: number,
): State => {
    const allItems = terminalSelectorItems.map(mapToGridItem(serviceProviders));
    return initState(allItems, itemsOnPage);
};

const initState = (allItems: GridItem[], itemsOnPage: number): State => {
    const pages = toPages(allItems, itemsOnPage);
    return {
        pages,
        pageItems: pages.length > 0 ? pages[0].items : [],
        isPrevious: false,
        isNext: pages.length > 1,
        page: 1,
        totalPages: pages.length,
        itemsOnPage,
        allItems,
    };
};

const next = (state: State): State => {
    const isNext = state.isNext;
    if (!isNext) {
        return state;
    }
    const currPageIndex = state.page;
    return {
        ...state,
        pageItems: state.pages[currPageIndex].items,
        isPrevious: true,
        isNext: state.pages.length > state.page + 1,
        page: state.page + 1,
    };
};

const previous = (state: State): State => {
    const isPrevious = state.isPrevious;
    if (!isPrevious) {
        return state;
    }
    const currPageIndex = state.page - 2;
    const currPage = state.page - 1;
    return {
        ...state,
        pageItems: state.pages[currPageIndex].items,
        isPrevious: currPage !== 1,
        isNext: true,
        page: currPage,
    };
};

const byBrandName =
    (filterStr: string) =>
    ({ brandName }: GridItem) =>
        brandName.toLowerCase().includes(filterStr.toLowerCase());

const filterPages = (state: State, filterStr: string): State => {
    let filtered = state.allItems.concat();
    if (filterStr !== '') {
        filtered = state.allItems.filter(byBrandName(filterStr));
    }

    return {
        ...state,
        ...initState(filtered, state.itemsOnPage),
        allItems: state.allItems.concat(),
    };
};

const gridPagesReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'NEXT':
            return next(state);
        case 'PREVIOUS':
            return previous(state);
        case 'FILTER_PAGES':
            return filterPages(state, action.payload);
    }
};

export const useGridPages = (
    items: TerminalSelectorItem[],
    serviceProviders: TerminalServiceProvider[],
    itemsOnPage: number,
): [
    State,
    {
        next: () => void;
        previous: () => void;
        filter: (str: string) => void;
    },
] => {
    const [state, dispatch] = useReducer(gridPagesReducer, mapToInitState(serviceProviders, items, itemsOnPage));

    const next = useCallback(() => {
        dispatch({ type: 'NEXT' });
    }, []);

    const previous = useCallback(() => {
        dispatch({ type: 'PREVIOUS' });
    }, []);

    const filter = useCallback(
        (filterStr: string) => {
            dispatch({
                type: 'FILTER_PAGES',
                payload: filterStr,
            });
        },
        [serviceProviders],
    );

    return [
        state,
        {
            next,
            previous,
            filter,
        },
    ];
};
