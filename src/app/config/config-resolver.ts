import * as URL from 'url-parse';
import { Transport, PossibleEvents } from '../../communication-ts';
import { Config, InitConfig } from '.';
import { getIntegrationType } from './get-integration-type';
import { deserialize } from 'checkout/utils';

export class ConfigResolver {

    static resolve(transport: Transport): Promise<Config> {
        return this.resolveInitConfig(transport)
            .then((initConfig) => ({
                origin: this.getOrigin(),
                initConfig: ConfigResolver.toInitConfig(initConfig),
                ready: false
            }));
    }

    private static toInitConfig(initConfig: InitConfig): InitConfig {
        return {...new InitConfig(), ...initConfig};
    }

    private static resolveInitConfig(transport: Transport): Promise<InitConfig> {
        return new Promise((resolve) => {
            this.isUriContext()
                ? resolve(deserialize(location.search))
                : transport.on(PossibleEvents.init, (config) => resolve(config));
        }).then((config: InitConfig) => {
            config.integrationType = getIntegrationType(config);
            return config;
        });
    }

    private static isUriContext(): boolean {
        return !!location.search;
    }

    private static getOrigin(): string {
        const currentScript: any = document.currentScript || this.getCurrentScript();
        const url = URL(currentScript.src);
        return url.origin;
    }

    private static getCurrentScript(): HTMLElement {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    }
}