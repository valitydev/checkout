import { InitConfig } from 'checkout/init';
import { isNil } from 'checkout/utils';

export const toCustomizationContext = ({
    name,
    description,
    locale,
    obscureCardCvv,
    requireCardHolder,
}: InitConfig) => ({
    name,
    description,
    initLocaleCode: locale,
    obscureCardCvv: isNil(obscureCardCvv) || true,
    requireCardHolder: isNil(requireCardHolder) || true,
});
