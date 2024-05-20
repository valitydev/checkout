import { Flex } from '@chakra-ui/react';

import { ServiceProviderIconMetadata } from 'checkout/backend/payments/serviceProviderMetadata';

export type MetadataLogoBoxProps = {
    logo: ServiceProviderIconMetadata;
};

export function MetadataLogoBox({ logo: { height, width, src } }: MetadataLogoBoxProps) {
    return (
        <Flex alignItems="center" height={12} justifyContent="center">
            <img height={height} src={src} width={width} />
        </Flex>
    );
}
