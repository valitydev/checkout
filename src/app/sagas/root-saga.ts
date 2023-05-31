import { all } from 'redux-saga/effects';
import { watchInitializeModal } from './initialize-modal';

export default function* rootSaga() {
    yield all([watchInitializeModal()]);
}
