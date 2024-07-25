import { StackProps, useColorModeValue, VStack } from '@chakra-ui/react';

export type PaneProps = StackProps;

export function Pane(props: PaneProps) {
    const { children, ...rest } = props;
    const hoverBorderColor = useColorModeValue('gray.300', 'whiteAlpha.400');

    return (
        <VStack
            _hover={{ borderColor: hoverBorderColor }}
            align="stretch"
            border="1px"
            borderColor="chakra-border-color"
            borderRadius="lg"
            cursor="pointer"
            p={4}
            spacing={2}
            {...rest}
        >
            {children}
        </VStack>
    );
}
