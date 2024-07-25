import { Center, CenterProps, useColorModeValue } from '@chakra-ui/react';

export function PaneLogoBox(props: CenterProps) {
    const { children, ...rest } = props;
    const bgColor = useColorModeValue('white', 'gray.200');

    return (
        <Center bgColor={bgColor} borderRadius="md" height={16} p={4} userSelect="none" {...rest}>
            {children}
        </Center>
    );
}
