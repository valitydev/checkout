import { useMemo } from 'react';
import { HiQuestionMarkCircle } from 'react-icons/hi';

import {
    ServiceProviderMetadataImage,
    ServiceProviderMetadataLogo,
} from 'checkout/backend/payments/serviceProviderMetadata';
import { isNil } from 'checkout/utils';

import { PaneLogo } from './PaneLogo';
import { PaneMetadataBuildInIcon } from './PaneMetadataBuildInIcon';
import { PaneMetadataImageLogo } from './PaneMetadataImageLogo';

export type PaneMetadataLogoProps = {
    logo: ServiceProviderMetadataLogo;
};

const isServiceProviderMetadataImage = (logo: ServiceProviderMetadataLogo): logo is ServiceProviderMetadataImage => {
    return isNil(logo.type) || logo.type === 'image';
};

export function PaneMetadataLogo({ logo }: PaneMetadataLogoProps) {
    const metadataLogo = useMemo(() => {
        if (isServiceProviderMetadataImage(logo)) {
            const requiredImage: Required<ServiceProviderMetadataImage> = {
                ...logo,
                type: 'image',
            };
            return requiredImage;
        }
        if (logo.type === 'buildInIcon') {
            return logo;
        }
        console.error('ServiceProvider metadata logo is unsupported', logo);
        return null;
    }, [logo]);

    return (
        <>
            {isNil(metadataLogo) && <PaneLogo as={HiQuestionMarkCircle} />}
            {!isNil(metadataLogo) && metadataLogo.type === 'image' && <PaneMetadataImageLogo logo={metadataLogo} />}
            {!isNil(metadataLogo) && metadataLogo.type === 'buildInIcon' && (
                <PaneMetadataBuildInIcon logo={metadataLogo} />
            )}
        </>
    );
}
