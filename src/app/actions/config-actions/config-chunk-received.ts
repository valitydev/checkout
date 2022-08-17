import { AbstractAction, TypeKeys } from 'checkout/actions';
import { Locale } from 'checkout/locale';
import { AppConfig, Env } from 'checkout/backend';

export interface ConfigChunk {
    appConfig: AppConfig;
    env: Env;
    locale: Locale;
}

export interface ConfigChunkReceived extends AbstractAction<ConfigChunk> {
    type: TypeKeys.CONFIG_CHUNK_RECEIVED;
    payload: ConfigChunk;
}
