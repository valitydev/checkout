import { ImageProps, Image } from '@chakra-ui/react';

import { ServiceProviderIconMetadata } from 'checkout/backend/payments/serviceProviderMetadata';

export type PaneMetadataLogoProps = { logo: ServiceProviderIconMetadata } & ImageProps;

export function PaneMetadataLogo(props: PaneMetadataLogoProps) {
    const { logo, ...rest } = props;
    return <Image height={logo.height} src={logo.src} width={logo.width} {...rest} />;
}
