import { all } from 'redux-saga/effects';
import { watchPayment } from './payment';
import { watchInitializeModal } from './initialize-modal';
import { watchInitializeEvents } from './poll-events';

export default function* rootSaga() {
    yield all([watchInitializeModal(), watchPayment(), watchInitializeEvents()]);
}
