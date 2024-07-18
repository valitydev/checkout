import { Center, Image, Square, useColorModeValue } from '@chakra-ui/react';
import { HiOutlineCash } from 'react-icons/hi';

import { ServiceProviderIconMetadata } from 'checkout/backend/payments/serviceProviderMetadata';
import { isNil } from 'checkout/utils';

export type MetadataLogoBoxProps = {
    logo?: ServiceProviderIconMetadata;
    height: number;
};

export function MetadataLogoBox({ logo, height }: MetadataLogoBoxProps) {
    const bgColor = useColorModeValue('white', 'gray.100');

    return (
        <Center bgColor={bgColor} borderRadius="md" height={height} p={4} userSelect="none">
            {!isNil(logo) && <Image height={logo.height} src={logo.src} width={logo.width} />}
            {isNil(logo) && <Square as={HiOutlineCash} color="gray.600" size={12} />}
        </Center>
    );
}
