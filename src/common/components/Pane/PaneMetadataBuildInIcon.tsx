import { HiCash, HiCreditCard, HiLibrary, HiQuestionMarkCircle } from 'react-icons/hi';

import { ServiceProviderMetadataBuildInIcon } from 'checkout/backend/payments/serviceProviderMetadata';
import { isNil } from 'checkout/utils';

import { PaneLogo } from './PaneLogo';

export type PaneMetadataBuildInIconProps = {
    logo: ServiceProviderMetadataBuildInIcon;
};

export function PaneMetadataBuildInIcon({ logo: { name } }: PaneMetadataBuildInIconProps) {
    const buildInIcons = {
        HiCreditCard: HiCreditCard,
        HiCash: HiCash,
        HiLibrary: HiLibrary,
    };
    const icon = buildInIcons[name];

    if (isNil(icon)) {
        console.error(
            `Build in icon: ${name} is not found. Supported icon list: [${Object.keys(
                buildInIcons,
            )}]. Default icon will be used.`,
        );
    }

    return <PaneLogo as={icon || HiQuestionMarkCircle} />;
}
