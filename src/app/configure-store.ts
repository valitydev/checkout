import { combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { reducer } from 'redux-form';
import { State } from './state';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export function configureStore(): Store<State> {
    const store: Store<State> = createStore(
        combineReducers<State>({
            form: reducer
        }),
        composeWithDevTools()
    );
    return store;
}

export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
