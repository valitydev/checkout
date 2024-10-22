import { appendInitButton } from './init-button/append-init-button';

const mapKeys = <T, K extends keyof any>(obj: Record<string, T>, mapper: (value: T, key: string) => K): Record<K, T> =>
    Object.entries(obj).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [mapper(value, key)]: value,
        }),
        {} as Record<K, T>,
    );

const getOuterForm = (element: HTMLScriptElement): HTMLFormElement | null => {
    const node = element.parentNode as HTMLFormElement;
    return node && node.nodeName === 'FORM' && node.action ? node : null;
};

const prepareUserConfig = (element: HTMLScriptElement): { [key: string]: string | (() => void) } => ({
    ...mapKeys(element.dataset, (_value, key) => key.replace('Id', 'ID')),
    finished: () => {
        const outerForm = getOuterForm(element);
        if (outerForm) {
            outerForm.submit();
        }
    },
});

export class HtmlIntegration {
    isAvailable: boolean;
    private origin: string;
    private element: HTMLScriptElement;

    constructor(origin: string) {
        this.origin = origin;
        this.element = document.querySelector('.vality-checkout') as HTMLScriptElement;
        this.isAvailable = !!(this.element && this.element.dataset);
    }

    getUserConfig(): { [key: string]: string | (() => void) } {
        return prepareUserConfig(this.element);
    }

    renderPayButton(label: string): HTMLButtonElement {
        return appendInitButton(this.origin, this.element, label);
    }
}
