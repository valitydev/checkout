import { getOrigin } from '../common/utils/getOrigin';

export const domReady = (): Promise<string> => {
    const origin = getOrigin();
    return new Promise((resolve) => {
        let ready = false;

        const detach = () => {
            if (document.addEventListener) {
                document.removeEventListener('DOMContentLoaded', completed);
                window.removeEventListener('load', completed);
            } else {
                (document as any).detachEvent('onreadystatechange', completed);
                (window as any).detachEvent('onload', completed);
            }
        };

        const completed = () => {
            if (!ready && (document.addEventListener || event.type === 'load' || document.readyState === 'complete')) {
                ready = true;
                detach();
                resolve(origin);
            }
        };

        if (document.readyState === 'complete') {
            resolve(origin);
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', completed);
            window.addEventListener('load', completed);
        } else {
            (document as any).attachEvent('onreadystatechange', completed);
            (window as any).attachEvent('onload', completed);
            let top: any = false;
            try {
                top = window.frameElement === null && document.documentElement;
            } catch (e) {} // eslint-disable-line no-empty
            if (top && top.doScroll) {
                (function scrollCheck() {
                    if (ready) {
                        return;
                    }
                    try {
                        top.doScroll('left');
                    } catch (e) {
                        return setTimeout(scrollCheck, 50);
                    }
                    ready = true;
                    detach();
                    resolve(origin);
                })();
            }
        }
    });
};
