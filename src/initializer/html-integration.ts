import { appendInitButton } from './init-button/append-init-button';

const mapKeys = (obj, mapper) =>
    Object.entries(obj).reduce(
        (acc, [key, value]) => ({
            ...acc,
            [mapper(value, key)]: value,
        }),
        {},
    );

const getOuterForm = (element: HTMLScriptElement) => {
    const node = element.parentNode as HTMLFormElement;
    return node && node.nodeName === 'FORM' && node.action ? node : null;
};

const prepareUserConfig = (element: HTMLScriptElement): object => ({
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

    getUserConfig(): any {
        return prepareUserConfig(this.element);
    }

    renderPayButton(label: string): HTMLButtonElement {
        return appendInitButton(this.origin, this.element, label);
    }
}
