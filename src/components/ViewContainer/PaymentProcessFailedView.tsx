import { WarningIcon } from '@chakra-ui/icons';
import { Flex, Spacer, VStack, Text, Button } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';

import { LocaleContext, PaymentConditionsContext } from 'checkout/contexts';
import { isNil, last } from 'checkout/utils';

const isResponseErrorWithMessage = (error: any): boolean => {
    if (isNil(error)) return false;
    return !isNil(error?.details?.message);
};

const getErrorDescription = (error: any): string => {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    if (isResponseErrorWithMessage(error)) {
        return error.details.message;
    }
    return JSON.stringify(error);
};

export function PaymentProcessFailedView() {
    const { l } = useContext(LocaleContext);
    const { conditions } = useContext(PaymentConditionsContext);

    const exception = useMemo(() => {
        const lastCondition = last(conditions);
        if (lastCondition.name === 'paymentProcessFailed') {
            return lastCondition.exception;
        }
        return null;
    }, [conditions]);

    return (
        <VStack align="stretch" minH="sm" spacing={6}>
            <Spacer />
            <Flex justifyContent="center">
                <WarningIcon boxSize="28" color="red.500" />
            </Flex>
            <VStack align="stretch" spacing={3}>
                <Text color="red.500" fontSize="4xl" fontWeight="medium" textAlign="center">
                    {l['form.header.final.error.label']}
                </Text>
                {!isNil(exception) && (
                    <Text fontSize="lg" textAlign="center">
                        {getErrorDescription(exception)}
                    </Text>
                )}
            </VStack>
            <Spacer />
            <VStack align="stretch" spacing={6}>
                <Button
                    borderRadius="lg"
                    colorScheme="brand"
                    size="lg"
                    variant="solid"
                    onClick={() => location.reload()}
                >
                    {l['form.button.reload']}
                </Button>
            </VStack>
        </VStack>
    );
}
