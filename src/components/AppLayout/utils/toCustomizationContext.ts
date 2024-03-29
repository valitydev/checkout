import { InitConfig } from '../../../common/init';
import { isNil } from '../../../common/utils';

export const toCustomizationContext = ({
    name,
    description,
    locale,
    obscureCardCvv,
    requireCardHolder,
}: InitConfig) => ({
    name,
    description,
    localeCode: locale,
    obscureCardCvv: isNil(obscureCardCvv) || true,
    requireCardHolder: isNil(requireCardHolder) || true,
});
