import * as creditCardType from 'credit-card-type';

import { resolveInitConfig } from './configResolver';
import { AppConfig, InitParams } from './types';
import { listen, Transport, StubTransport, CommunicatorEvents, communicatorInstanceName } from '../../communicator';
import { fetchConfig, getOrigin, getUrlParams, URLParams, withRetry } from '../utils';

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
    const { init, BrowserTracing } = await import('@sentry/react');
    const { CaptureConsole } = await import('@sentry/integrations');
    init({
        environment: 'production',
        dsn,
        integrations: [
            new BrowserTracing(),
            new CaptureConsole({
                levels: ['error', 'warn'],
            }),
        ],
        tracesSampleRate: 0.01,
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

export const initialize = async (): Promise<[Transport, InitParams]> => {
    const [transport, params] = await resolveUriParams();
    const initConfig = resolveInitConfig(params);
    const fetchAppConfig = withRetry(fetchConfig<AppConfig>);
    const appConfig = await fetchAppConfig('./appConfig.json');
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
        transport.emit(CommunicatorEvents.close);
        throw e;
    }
};
