import { all } from 'redux-saga/effects';
import { watchPayment } from './payment';
import { watchFinishInteraction } from './finish-interaction';
import { watchInitializeModal } from './initialize-modal';

export default function* rootSaga() {
    yield all([watchInitializeModal(), watchPayment(), watchFinishInteraction()]);
}
