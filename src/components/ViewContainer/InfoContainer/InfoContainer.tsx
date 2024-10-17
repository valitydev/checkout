import { Button, Flex, Text, VStack, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useContext } from 'react';
import { HiArrowLeft, HiChevronDown } from 'react-icons/hi';

import { CustomizationContext, LocaleContext, PaymentModelContext } from 'checkout/contexts';
import { isNil, truncate } from 'checkout/utils';

import { DetailsDrawer } from './DetailsDrawer';

export type InfoProps = {
    viewAmount: string;
};

export function InfoContainer({ viewAmount }: InfoProps) {
    const { name, description } = useContext(CustomizationContext);
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { l } = useContext(LocaleContext);
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);

    return (
        <>
            <VStack align="stretch" spacing={3} width={['inherit', 'inherit', '64']}>
                {!isNil(initContext.cancelUrl) && (
                    <VStack align="start">
                        <Button
                            colorScheme="gray"
                            leftIcon={<HiArrowLeft />}
                            variant="link"
                            onClick={() => {
                                window.open(initContext.cancelUrl, '_self');
                            }}
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
                        <Button colorScheme="gray" rightIcon={<HiChevronDown />} onClick={onOpen}>
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
