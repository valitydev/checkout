export type InitConfig = {
    integrationType?: 'invoice' | 'invoiceTemplate';
    invoiceID?: string;
    invoiceAccessToken?: string;
    invoiceTemplateID?: string;
    invoiceTemplateAccessToken?: string;
    locale?: string;
    redirectUrl?: string;
    cancelUrl?: string;
    name?: string;
    description?: string;
    obscureCardCvv?: boolean;
    requireCardHolder?: boolean;
    recurring?: boolean;
    theme?: string;
    metadata?: object;
    terminalFormValues?: object;
    skipUserInteraction?: boolean;
    isExternalIDIncluded?: boolean;
    paymentFlow?: object;
    deepLink?: string;
    email?: string;
    phoneNumber?: string;
    dateOfBirth?: string | boolean;
    documentId?: string | boolean;
};

export type ThemeConfig = Record<string, any>;

export type AppConfig = {
    capiEndpoint?: string;
    wrapperEndpoint?: string;
    brandless?: boolean;
    fixedTheme?: string;
    brandName?: string;
    urlShortenerEndpoint?: string;
    sentryDsn?: string;
    themes: ThemeConfig[];
};

export type InitParams = {
    initConfig: InitConfig;
    appConfig: AppConfig;
    origin: string;
};
