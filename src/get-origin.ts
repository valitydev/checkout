export const ieCurrentScriptStub = {
    src: `${document.location.origin}/checkout.js`,
};

const getCurrentScript = (): HTMLScriptElement => (document.currentScript || ieCurrentScriptStub) as HTMLScriptElement;

export const getOrigin = (): string => new URL(getCurrentScript().src).origin;
