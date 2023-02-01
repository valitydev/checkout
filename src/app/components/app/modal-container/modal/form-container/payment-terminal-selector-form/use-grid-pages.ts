import { ServiceProvider } from 'checkout/backend';
import { useCallback, useReducer } from 'react';

type ServiceProviderPage = {
    items: ServiceProvider[];
};

const toPages = (serviceProviders: ServiceProvider[], itemsOnPage: number): ServiceProviderPage[] => {
    let result = [];
    let start = 0;
    let end = itemsOnPage;
    let isMorePages = true;
    do {
        const sliced = serviceProviders.slice(start, end);
        isMorePages = sliced.length !== 0;
        if (isMorePages) {
            start = start + itemsOnPage;
            end = end + itemsOnPage;
            result = [
                ...result,
                {
                    items: sliced
                }
            ];
        }
    } while (isMorePages);
    return result;
};

type State = {
    pages: ServiceProviderPage[];
    pageItems: ServiceProvider[];
    isNext: boolean;
    isPrevious: boolean;
    page: number;
    totalPages: number;
    serviceProviders: ServiceProvider[];
    itemsOnPage: number;
};

type Action =
    | { type: 'NEXT' }
    | { type: 'PREVIOUS' }
    | {
          type: 'FILTER_PAGES';
          payload: string;
      };

const initPages = (serviceProviders: ServiceProvider[], itemsOnPage: number): State => {
    const pages = toPages(serviceProviders, itemsOnPage);
    return {
        pages,
        pageItems: pages.length > 0 ? pages[0].items : [],
        isPrevious: false,
        isNext: pages.length > 1,
        page: 1,
        totalPages: pages.length,
        serviceProviders,
        itemsOnPage
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
        page: state.page + 1
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
        page: currPage
    };
};

const byBrandName = (filterStr: string) => ({ brandName }: ServiceProvider) =>
    brandName.toLowerCase().includes(filterStr.toLowerCase());

const filterPages = (state: State, filterStr: string): State => {
    let filtered = state.serviceProviders.concat();
    if (filterStr !== '') {
        filtered = state.serviceProviders.filter(byBrandName(filterStr));
    }
    return {
        ...state,
        ...initPages(filtered, state.itemsOnPage),
        serviceProviders: state.serviceProviders.concat()
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
    serviceProviders: ServiceProvider[],
    itemsOnPage: number
): [
    State,
    {
        next: () => void;
        previous: () => void;
        filter: (str: string) => void;
    }
] => {
    const [state, dispatch] = useReducer(gridPagesReducer, initPages(serviceProviders, itemsOnPage));

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
                payload: filterStr
            });
        },
        [serviceProviders]
    );

    return [
        state,
        {
            next,
            previous,
            filter
        }
    ];
};
