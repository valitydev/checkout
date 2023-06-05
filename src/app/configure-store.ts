import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { State } from './state';
import { modalReducer } from './reducers';
import rootSaga from 'checkout/sagas/root-saga';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export function configureStore(): Store<State> {
    const sagaMiddleware = createSagaMiddleware();
    const store: Store<State> = createStore(
        combineReducers<State>({
            form: formReducer as any,
            modals: modalReducer
        }),
        composeWithDevTools(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    return store;
}

export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
