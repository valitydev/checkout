import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { State } from './state';
import { resultReducer, modelReducer, errorReducer, modalReducer, eventsReducer } from './reducers';
import rootSaga from 'checkout/sagas/root-saga';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export function configureStore(initState: any): Store<State> {
    const sagaMiddleware = createSagaMiddleware();
    const store: Store<State> = createStore(
        combineReducers<State>({
            result: resultReducer,
            model: modelReducer,
            error: errorReducer,
            form: formReducer as any,
            modals: modalReducer,
            events: eventsReducer
        }),
        initState,
        composeWithDevTools(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    return store;
}

export const useAppDispatch = () => useDispatch();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
