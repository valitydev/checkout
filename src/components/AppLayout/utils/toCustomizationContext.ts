import { InitConfig } from 'checkout/config';

export const toCustomizationContext = ({ name, description, locale }: InitConfig) => ({
    name,
    description,
    localeCode: locale,
});
