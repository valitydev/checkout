import { ChevronDownIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import { Button, Flex, Text, VStack, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useContext } from 'react';

import { CustomizationContext, LocaleContext } from 'checkout/contexts';
import { truncate } from 'checkout/utils';

import { DetailsDrawer } from './DetailsDrawer';

export type InfoProps = {
    viewAmount: string;
};

export function InfoContainer({ viewAmount }: InfoProps) {
    const { name, description } = useContext(CustomizationContext);
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { l } = useContext(LocaleContext);

    return (
        <>
            <VStack align="stretch" spacing={3} width={['inherit', 'inherit', '64']}>
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
                    <Text fontSize="3xl" fontWeight="medium">
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
            <DetailsDrawer description={description} isOpen={isOpen} name={name} onClose={onClose} />
        </>
    );
}
