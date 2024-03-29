import { initButton } from './init-button.css';
import { detectLocale } from '../../common/utils/detectLocale';

const getDefaultLabel = (): string => (detectLocale(null) === 'ru' ? 'Оплатить' : 'Pay');

const appendPayButtonStyles = (origin: string) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', `${origin}/checkout.css`);
    document.getElementsByTagName('head')[0].appendChild(link);
};

export const appendInitButton = (origin: string, appendEl: HTMLScriptElement, label: string): HTMLButtonElement => {
    appendPayButtonStyles(origin);
    const button = document.createElement('button');
    button.id = 'vality-button';
    button.className = initButton;
    button.innerHTML = label || getDefaultLabel();
    appendEl.parentNode.appendChild(button);
    return button;
};
