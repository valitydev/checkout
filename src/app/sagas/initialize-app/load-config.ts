import { all, call, put, select } from 'redux-saga/effects';
import { AppConfig, getAppConfig, getLocale } from '../../backend';
import { ConfigChunkReceived, TypeKeys } from 'checkout/actions';
import { State } from 'checkout/state';
import { Locale } from 'checkout/locale';

export function* loadConfig(localeName: string) {
    const [appConfig, locale]: [AppConfig, Locale] = yield all([call(getAppConfig), call(getLocale, localeName)]);
    yield put({
        type: TypeKeys.CONFIG_CHUNK_RECEIVED,
        payload: {
            appConfig,
            locale
        }
    } as ConfigChunkReceived);
    return yield select((state: State) => state.config);
}
