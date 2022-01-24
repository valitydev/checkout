import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { State } from './state';
import {
    initializeAppReducer,
    resultReducer,
    configReducer,
    modelReducer,
    errorReducer,
    modalReducer,
    availablePaymentMethodsReducer,
    amountInfoReducer,
    eventsReducer
} from './reducers';
import rootSaga from 'checkout/sagas/root-saga';

export function configureStore(initState: any): Store<State> {
    const sagaMiddleware = createSagaMiddleware();
    const store: Store<State> = createStore(
        combineReducers<State>({
            initializeApp: initializeAppReducer,
            result: resultReducer,
            config: configReducer,
            model: modelReducer,
            error: errorReducer,
            form: formReducer as any,
            modals: modalReducer,
            availablePaymentMethods: availablePaymentMethodsReducer,
            amountInfo: amountInfoReducer,
            events: eventsReducer
        }),
        initState,
        composeWithDevTools(applyMiddleware(sagaMiddleware))
    );
    sagaMiddleware.run(rootSaga);
    return store;
}
