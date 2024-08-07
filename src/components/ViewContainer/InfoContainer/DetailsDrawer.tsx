import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerOverlay,
    IconButton,
    VStack,
    Text,
} from '@chakra-ui/react';
import { HiChevronUp } from 'react-icons/hi';

import { truncate } from 'checkout/utils';

export type DetailsDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    name?: string;
    description?: string;
};

export function DetailsDrawer({ isOpen, onClose, name, description }: DetailsDrawerProps) {
    return (
        <Drawer isOpen={isOpen} placement="top" size="sm" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerBody>
                    <VStack align="stretch">
                        {name && (
                            <Text fontSize="xl" fontWeight="medium">
                                {truncate(name, 100)}
                            </Text>
                        )}
                        {description && <Text fontSize="lg">{truncate(description, 140)}</Text>}
                    </VStack>
                </DrawerBody>
                <DrawerFooter>
                    <IconButton aria-label="close" colorScheme="gray" icon={<HiChevronUp />} onClick={onClose} />
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
