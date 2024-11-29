import { InitConfig } from '../common/init';

type AnyFunction = (...args: any[]) => any;

const isFunction = (val: unknown): val is AnyFunction => typeof val === 'function';

const mapValue = <T, U>(
    object: Record<string, T>,
    iteratee: (value: T, key: string, object: Record<string, T>) => U,
): Record<string, U> => {
    object = Object(object);
    const result: Record<string, U> = {};
    Object.keys(object).forEach((key) => {
        result[key] = iteratee(object[key], key, object);
    });
    return result;
};

const mapBoolean = (obj: Record<string, unknown>): Record<string, unknown> =>
    mapValue(obj, (value) => {
        switch (value) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return value;
        }
    });

interface UserConfig {
    locale?: string;
    [key: string]: unknown;
}

const getLocale = (userConfig: UserConfig): string => userConfig.locale || 'auto';

const prepareConfig = (userConfig: UserConfig): UserConfig => ({
    ...mapBoolean(userConfig),
    locale: getLocale(userConfig),
});

const dummyFn: ActionCallback = () => undefined;

type ActionCallback = () => void;

const initCallback = (fn: unknown): ActionCallback => (isFunction(fn) ? fn : dummyFn);

export abstract class Initializer {
    protected config: UserConfig;
    protected origin: string;
    protected opened: ActionCallback;
    protected closed: ActionCallback;
    protected finished: ActionCallback;

    constructor(origin: string, userConfig: UserConfig) {
        this.config = prepareConfig(userConfig);
        this.origin = origin;
        this.opened = initCallback(userConfig.opened);
        this.closed = initCallback(userConfig.closed);
        this.finished = initCallback(userConfig.finished);
    }

    abstract open(config?: InitConfig): void;

    abstract close(): void;
}
