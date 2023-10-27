import * as creditCardType from 'credit-card-type';

import { InitConfig, resolveInitConfig } from 'checkout/config';
import { getUrlParams, URLParams } from 'checkout/utils';

import { AppConfig, getAppConfig, getEnv } from './backend';
import { listen, Transport, StubTransport, CommunicatorEvents, communicatorInstanceName } from '../communicator';
import { getOrigin } from '../get-origin';

/**
 * Additional card brands
 */
creditCardType.addCard({
    niceType: 'UzCard',
    type: 'uzcard',
    patterns: [8600],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
        name: 'CVV',
        size: 3,
    },
});

creditCardType.addCard({
    niceType: 'Humo',
    type: 'humo',
    patterns: [9860],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
        name: 'CVV',
        size: 3,
    },
});

const initSentry = async (dsn: string) => {
    const { init, BrowserTracing, Replay } = await import('@sentry/react');
    const { CaptureConsole } = await import('@sentry/integrations');
    const env = await getEnv();
    init({
        environment: 'production',
        dsn,
        integrations: [
            new BrowserTracing(),
            new CaptureConsole({
                levels: ['error'],
            }),
            new Replay(),
        ],
        tracesSampleRate: 0.1,
        release: env.version,
        replaysOnErrorSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
    });
};

const resolveUriParams = async (): Promise<[Transport, URLParams]> => {
    let transport;
    try {
        transport = await listen(communicatorInstanceName, window.opener ? 2000 : 0);
    } catch (e) {
        transport = new StubTransport();
    }
    const params = getUrlParams(location.search);
    return [transport, params];
};

export type InitParams = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    origin: string;
};

export const initialize = async (): Promise<[Transport, InitParams]> => {
    const [transport, params] = await resolveUriParams();
    const initConfig = resolveInitConfig(params);
    const appConfig = await getAppConfig();
    if (appConfig.sentryDsn) {
        await initSentry(appConfig.sentryDsn);
    }
    const origin = getOrigin();
    try {
        return [
            transport,
            {
                initConfig,
                appConfig,
                origin,
            },
        ];
    } catch (e) {
        console.error(e);
        transport.emit(CommunicatorEvents.close);
        throw e;
    }
};
