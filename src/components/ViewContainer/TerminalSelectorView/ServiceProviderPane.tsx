import { VStack, Text, useColorModeValue } from '@chakra-ui/react';

import { ServiceProviderIconMetadata } from 'checkout/backend/payments/serviceProviderMetadata';
import { MetadataLogoBox } from 'checkout/components';

type ServiceProviderPaneProps = {
    logo?: ServiceProviderIconMetadata;
    text: string;
    onClick: () => void;
};

export function ServiceProviderPane({ text, logo, onClick }: ServiceProviderPaneProps) {
    const hoverBorderColor = useColorModeValue('gray.300', 'whiteAlpha.400');

    return (
        <VStack
            _hover={{ borderColor: hoverBorderColor }}
            align="stretch"
            border="1px"
            borderColor="chakra-border-color"
            borderRadius="lg"
            cursor="pointer"
            p={2}
            spacing={2}
            onClick={onClick}
        >
            <MetadataLogoBox height={16} logo={logo} />
            <Text
                fontWeight="medium"
                overflow="hidden"
                textAlign="center"
                textOverflow="ellipsis"
                userSelect="none"
                whiteSpace="nowrap"
            >
                {text}
            </Text>
        </VStack>
    );
}
