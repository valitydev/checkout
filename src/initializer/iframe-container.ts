const s4 = (): string =>
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);

const generateId = (): string => `${s4()}${s4()}${s4()}${s4()}`;

const styles: Partial<CSSStyleDeclaration> = {
    overflowX: 'hidden',
    overflowY: 'auto',
    visibility: 'visible',
    border: '0 none transparent',
    display: 'none',
    margin: '0px',
    padding: '0px',
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    zIndex: '2147483647',
};

const setStyles = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void => {
    for (const property in styles) {
        // eslint-disable-next-line no-prototype-builtins
        if (styles.hasOwnProperty(property)) {
            element.style[property as any] = styles[property as keyof CSSStyleDeclaration] as string;
        }
    }
};

const create = (origin: string): HTMLIFrameElement => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `${origin}/v1/checkout.html`);
    iframe.setAttribute('name', `vality-payframe-${generateId()}`);
    iframe.setAttribute('class', 'vality-payframe');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowpaymentrequest', '');
    setStyles(iframe, {
        ...iframe.style,
        ...styles,
    });
    return iframe;
};

export class IframeContainer {
    private container: HTMLIFrameElement;

    constructor(origin: string) {
        this.container = create(origin);
        this.render();
    }

    reinitialize(): void {
        this.hide();
        this.destroy();
        this.render();
    }

    render(): void {
        document.body.appendChild(this.container);
    }

    destroy(): void {
        document.body.removeChild(this.container);
    }

    show(): void {
        this.container.style.display = 'block';
    }

    hide(): void {
        this.container.style.display = 'none';
    }

    getName(): string {
        return this.container.getAttribute('name') || '';
    }
}
