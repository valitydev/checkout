import { WarningIcon, InfoIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { Button, Flex, Spacer, VStack, Text } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import {
    CompletePaymentContext,
    LocaleContext,
    PaymentConditionsContext,
    PaymentModelContext,
    ViewModelContext,
} from 'checkout/contexts';
import { isNil, last } from 'checkout/utils';

import { IconName } from './types';
import { getPaymentFormViewId, getResultInfo } from './utils';

const ResultIcon = ({ iconName, color }: { iconName: IconName; color: string }) => (
    <>
        {iconName === 'CheckIcon' && <CheckCircleIcon boxSize="28" color={color} />}
        {iconName === 'WarningIcon' && <WarningIcon boxSize="28" color={color} />}
        {iconName === 'InfoIcon' && <InfoIcon boxSize="28" color={color} />}
    </>
);

export function PaymentResultView() {
    const { l } = useContext(LocaleContext);
    const { conditions } = useContext(PaymentConditionsContext);
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);
    const { onComplete } = useContext(CompletePaymentContext);
    const { viewModel, goTo } = useContext(ViewModelContext);

    const paymentFormViewId = getPaymentFormViewId(viewModel.views);

    const lastCondition = last(conditions);
    const { iconName, label, description, hasActions, color } = getResultInfo(lastCondition);

    useEffect(() => {
        switch (lastCondition.name) {
            case 'invoiceStatusChanged':
                if (lastCondition.status === 'paid') {
                    onComplete();
                }
                break;
            case 'paymentStatusChanged':
                if (lastCondition.status === 'processed' || lastCondition.status === 'captured') {
                    onComplete();
                }
                break;
        }
    }, [onComplete, lastCondition]);

    return (
        <VStack align="stretch" minH="sm" spacing={6}>
            <Spacer />
            <Flex justifyContent="center">
                <ResultIcon color={color} iconName={iconName} />
            </Flex>
            <VStack align="stretch" spacing={3}>
                <Text color={color} fontSize="4xl" fontWeight="medium" textAlign="center">
                    {l[label]}
                </Text>
                {!isNil(description) && (
                    <Text fontSize="lg" textAlign="center">
                        {l[description]}
                    </Text>
                )}
            </VStack>
            <Spacer />
            <VStack align="stretch" spacing={6}>
                {hasActions && !isNil(paymentFormViewId) && (
                    <Button
                        borderRadius="xl"
                        colorScheme="teal"
                        size="lg"
                        variant="solid"
                        onClick={() => goTo(paymentFormViewId)}
                    >
                        {l['form.button.pay.again.label']}
                    </Button>
                )}
                {initContext?.redirectUrl && (
                    <Button
                        colorScheme="teal"
                        size="lg"
                        variant="link"
                        onClick={() => window.open(initContext.redirectUrl, '_self')}
                    >
                        {l['form.button.back.to.website']}
                    </Button>
                )}
            </VStack>
        </VStack>
    );
}
