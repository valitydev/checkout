import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerOverlay,
    Flex,
    IconButton,
    Text,
    VStack,
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext } from 'checkout/contexts';

export type InfoProps = {
    viewAmount: string;
    name?: string;
    description?: string;
};

const truncate = (text: string, limit: number) => (text.length > limit ? text.substring(0, limit) + '...' : text);

export function InfoContainer({ name, description, viewAmount }: InfoProps) {
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { l } = useContext(LocaleContext);

    return (
        <>
            <VStack
                align="stretch"
                pl={[4, 4, 0]}
                pr={[4, 4, 0]}
                pt={[4, 4, 0]}
                spacing={3}
                width={['inherit', 'inherit', '64']}
            >
                {!isLargerThan768 && document.referrer !== '' && (
                    <VStack align="start">
                        <Button
                            colorScheme="gray"
                            leftIcon={<ChevronLeftIcon />}
                            variant="link"
                            onClick={() => window.history.back()}
                        >
                            {l['info.back']}
                        </Button>
                    </VStack>
                )}

                <Flex alignItems="center" justifyContent="space-between">
                    <Text fontSize={['3xl', '3xl', '4xl']} fontWeight="medium">
                        {viewAmount}
                    </Text>
                    {!isLargerThan768 && (name || description) && (
                        <Button colorScheme="gray" rightIcon={<ChevronDownIcon />} variant="ghost" onClick={onOpen}>
                            {l['info.details']}
                        </Button>
                    )}
                </Flex>

                {isLargerThan768 && name && (
                    <Text fontSize="xl" fontWeight="medium">
                        {truncate(name, 80)}
                    </Text>
                )}
                {isLargerThan768 && description && <Text fontSize="lg">{truncate(description, 120)}</Text>}
            </VStack>
            <Drawer isOpen={isOpen} placement="top" size="sm" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody>
                        <VStack align="stretch">
                            {name && (
                                <Text fontSize="xl" fontWeight="medium">
                                    {truncate(name, 80)}
                                </Text>
                            )}
                            {description && <Text fontSize="lg">{truncate(description, 120)}</Text>}
                        </VStack>
                    </DrawerBody>
                    <DrawerFooter>
                        <IconButton aria-label="close" colorScheme="gray" icon={<ChevronUpIcon />} onClick={onClose} />
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
