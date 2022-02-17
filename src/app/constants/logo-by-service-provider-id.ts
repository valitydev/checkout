export interface Logo {
    src: string;
    backgroundColor?: string;
}

export const LOGO_BY_SERVICE_PROVIDER_ID: { [name in string]: Logo } = {};
