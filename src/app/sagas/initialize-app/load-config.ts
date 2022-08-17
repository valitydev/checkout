import { all, call, put, select } from 'redux-saga/effects';
import { AppConfig, Env, getAppConfig, getEnv, getLocale } from '../../backend';
import { ConfigChunkReceived, TypeKeys } from 'checkout/actions';
import { State } from 'checkout/state';
import { Locale } from 'checkout/locale';

export function* loadConfig(localeName: string) {
    const [appConfig, env, locale]: [AppConfig, Env, Locale] = yield all([
        call(getAppConfig),
        call(getEnv),
        call(getLocale, localeName)
    ]);
    yield put({
        type: TypeKeys.CONFIG_CHUNK_RECEIVED,
        payload: {
            appConfig,
            env,
            locale
        }
    } as ConfigChunkReceived);
    return yield select((state: State) => state.config);
}
