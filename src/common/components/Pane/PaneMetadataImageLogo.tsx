import { ImageProps, Image } from '@chakra-ui/react';

import { ServiceProviderMetadataImage } from 'checkout/backend/payments/serviceProviderMetadata';

export type PaneMetadataImageLogoProps = { logo: ServiceProviderMetadataImage } & ImageProps;

export function PaneMetadataImageLogo(props: PaneMetadataImageLogoProps) {
    const { logo, ...rest } = props;
    return <Image height={logo.height} src={logo.src} width={logo.width} {...rest} />;
}
