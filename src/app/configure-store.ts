import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import { State } from './state';
import {
    resultReducer,
    configReducer,
    modelReducer,
    errorReducer,
    modalReducer
} from './reducers';

export function configureStore(initState: any): Store<State> {
    return createStore(combineReducers({
        result: resultReducer,
        config: configReducer,
        model: modelReducer,
        error: errorReducer,
        form: formReducer,
        modals: modalReducer
    }), initState, composeWithDevTools(applyMiddleware(thunk)));
}