import * as creditCardType from 'credit-card-type';
import * as Sentry from '@sentry/react';
import { HttpClient as HttpClientIntegration, CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';

import { listen, Transport, StubTransport, CommunicatorEvents, communicatorInstanceName } from '../communicator';
import { getUrlParams, URLParams } from 'checkout/utils';
import { InitConfig, resolveInitConfig } from 'checkout/config';
import { AppConfig, getAppConfig, getEnv } from './backend';
import { getOrigin } from '../get-origin';

/**
 * Adding available bank cards
 */
// TODO: update credit-card-type
(creditCardType as any).addCard({
    niceType: 'TestCard',
    type: 'test-card',
    patterns: [1234],
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
        name: 'CVV',
        size: 3
    }
});

const initSentry = async (dsn: string) => {
    const env = await getEnv();
    Sentry.init({
        environment: 'production',
        dsn,
        integrations: [
            new Sentry.BrowserTracing(),
            new HttpClientIntegration({
                failedRequestStatusCodes: [[400, 599]]
            }),
            new CaptureConsoleIntegration({
                levels: ['warn', 'error']
            })
        ],
        tracesSampleRate: 0.2,
        release: env.version
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
                origin
            }
        ];
    } catch (e) {
        console.error(e);
        transport.emit(CommunicatorEvents.close);
        throw e;
    }
};
