import { InitConfig } from '../common/init';

const isFunction = (val) => typeof val === 'function';

const mapValue = (object, iteratee) => {
    object = Object(object);
    const result = {};
    Object.keys(object).forEach((key) => {
        result[key] = iteratee(object[key], key, object);
    });
    return result;
};

const mapBoolean = (obj: object): object =>
    mapValue(obj, (value: any) => {
        switch (value) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return value;
        }
    });

const getLocale = (userConfig: any) => userConfig.locale || 'auto';

const prepareConfig = (userConfig: any): any => ({
    ...mapBoolean(userConfig),
    locale: getLocale(userConfig),
});

const dummyFn: ActionCallback = () => undefined;

type ActionCallback = () => void;

const initCallback = (fn: any): ActionCallback => (isFunction(fn) ? fn : dummyFn);

export abstract class Initializer {
    protected config: any;
    protected origin: string;
    protected opened: ActionCallback;
    protected closed: ActionCallback;
    protected finished: ActionCallback;

    constructor(origin: string, userConfig: any) {
        this.config = prepareConfig(userConfig);
        this.origin = origin;
        this.opened = initCallback(userConfig.opened);
        this.closed = initCallback(userConfig.closed);
        this.finished = initCallback(userConfig.finished);
    }

    abstract open(config?: InitConfig): void;

    abstract close(): void;
}
