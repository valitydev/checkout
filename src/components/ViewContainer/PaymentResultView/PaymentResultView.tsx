import { Button, Flex, Spacer, VStack, Text, LightMode } from '@chakra-ui/react';
import { useCallback, useContext, useEffect } from 'react';

import {
    CompletePaymentContext,
    LocaleContext,
    PaymentConditionsContext,
    PaymentModelContext,
    ViewModelContext,
} from 'checkout/contexts';
import { isNil, last } from 'checkout/utils';

import { ResultIcon } from './ResultIcon';
import { getPaymentFormViewId, getResultInfo, isExternalIdEmpty, isInstantPayment } from './utils';

export function PaymentResultView() {
    const { l } = useContext(LocaleContext);
    const { conditions } = useContext(PaymentConditionsContext);
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);
    const { onComplete } = useContext(CompletePaymentContext);
    const { viewModel, goTo } = useContext(ViewModelContext);
    const lastCondition = last(conditions);
    const { iconName, label, description, hasActions, color } = getResultInfo(lastCondition);

    const retry = useCallback(() => {
        if (isInstantPayment(conditions)) {
            location.reload();
            return;
        }
        const paymentFormViewId = getPaymentFormViewId(viewModel.views);
        goTo(paymentFormViewId);
    }, [conditions, viewModel.views]);

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
        <VStack align="stretch" minH="sm" spacing={5}>
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
                {hasActions && isExternalIdEmpty(conditions) && (
                    <LightMode>
                        <Button borderRadius="xl" colorScheme="brand" size="lg" variant="solid" onClick={retry}>
                            {l['form.button.pay.again.label']}
                        </Button>
                    </LightMode>
                )}
                {initContext?.redirectUrl && (
                    <LightMode>
                        <Button
                            colorScheme="brand"
                            size="lg"
                            variant="link"
                            onClick={() => window.open(initContext.redirectUrl, '_self')}
                        >
                            {l['form.button.back.to.website']}
                        </Button>
                    </LightMode>
                )}
            </VStack>
        </VStack>
    );
}
