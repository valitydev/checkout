import { VStack, Text, Button, Spacer, LightMode, useDisclosure } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { Destination } from 'checkout/backend/p2p';
import { LocaleContext, PaymentContext, PaymentModelContext } from 'checkout/contexts';

import { DestinationInfo } from './DestinationInfo';
import { LeaveAlert } from './LeaveAlert';
import { P2PAlert } from './P2PAlert';
import { UploadFileButton } from './UploadFileButton';
import { ApiExtensionViewContext } from '../ApiExtensionViewContext';
import { P2PApiError } from '../P2PApiError';
import { useComplete } from '../useComplete';

export type DestinationsProps = {
    destinations: Destination[];
};

export function Destinations({ destinations }: DestinationsProps) {
    const { l } = useContext(LocaleContext);
    const { apiEndpoint, invoiceAccessToken, invoiceID, paymentId } = useContext(ApiExtensionViewContext);
    const { startWaitingPaymentResult } = useContext(PaymentContext);
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const receiptRequired = destinations.reduce((acc, curr) => acc || !!curr.receiptRequired, false);

    const {
        completeState: { status },
        complete,
    } = useComplete(apiEndpoint, invoiceAccessToken, invoiceID, paymentId);

    useEffect(() => {
        if (status === 'SUCCESS') {
            startWaitingPaymentResult();
        }
    }, [status]);

    const handleFileUpload = (data: string, mimeType: string) => {
        complete({
            mimeType,
            data,
        });
    };

    return (
        <>
            <VStack align="stretch" minH="md" spacing={5}>
                <P2PAlert />
                <VStack align="stretch" spacing={3}>
                    {destinations.map((destination, index) => (
                        <DestinationInfo key={index} destination={destination} />
                    ))}
                </VStack>
                <Spacer />
                <VStack align="stretch" spacing={3}>
                    <Text fontSize="sm" textAlign="center">
                        {receiptRequired ? l['form.p2p.complete.info.attachment'] : l['form.p2p.complete.info']}
                    </Text>
                    <VStack align="stretch" spacing={4}>
                        {/* eslint-disable-next-line react/jsx-max-depth */}
                        <LightMode>
                            {receiptRequired === false && (
                                <Button
                                    borderRadius="xl"
                                    colorScheme="brand"
                                    isLoading={status === 'LOADING' || status === 'SUCCESS'}
                                    loadingText={l['form.p2p.complete.loading']}
                                    size="lg"
                                    onClick={() => complete()}
                                >
                                    {l['form.p2p.complete.button']}
                                </Button>
                            )}
                            {receiptRequired === true && (
                                <UploadFileButton
                                    isLoading={status === 'LOADING' || status === 'SUCCESS'}
                                    loadingText={l['form.p2p.complete.loading']}
                                    onUpload={handleFileUpload}
                                />
                            )}
                            {initContext?.redirectUrl && (
                                <Button colorScheme="brand" pt={4} size="lg" variant="link" onClick={() => onOpen()}>
                                    {l['form.button.back.to.website']}
                                </Button>
                            )}
                        </LightMode>
                    </VStack>
                    {status === 'FAILURE' && <P2PApiError l={l} />}
                </VStack>
            </VStack>
            <LeaveAlert isOpen={isOpen} onClose={onClose} />
        </>
    );
}
