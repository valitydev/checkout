import { Flex, Text } from '@chakra-ui/react';
import { ReactElement, cloneElement } from 'react';

export type IconPaneProps = {
    label: string;
    icon: ReactElement;
    isActive: boolean;
    onClick: () => void;
};

export function IconPane({ label, icon, isActive, onClick }: IconPaneProps) {
    const IconContainer = () => (
        <Flex alignItems="center" boxSize="12" justifyContent="center" mb={2} ml={2} mr={2} mt={4}>
            {cloneElement(icon, { boxSize: '100%' })}
        </Flex>
    );

    return (
        <Flex
            alignItems="center"
            border="2px solid"
            borderColor={isActive ? 'gray.500' : 'gray.200'}
            borderRadius="xl"
            boxSizing="border-box"
            cursor={'pointer'}
            direction="column"
            justifyContent="center"
            width="100%"
            onClick={onClick}
        >
            <IconContainer />
            <Text color="bodyText" mb={4} ml={2} mr={2} userSelect="none">
                {label}
            </Text>
        </Flex>
    );
}
