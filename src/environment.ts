import { Initializer } from './initializer/initializer';

export interface Environment extends Window {
    ValityCheckout?: Configurator;
}

export interface Configurator {
    configure: (userConfig: any) => Initializer;
}

export const environment = window as any as Environment;
