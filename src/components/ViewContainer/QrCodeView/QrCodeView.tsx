import { Divider, useClipboard, useToast, VStack, Text, Button, LightMode, Input } from '@chakra-ui/react';
import isMobile from 'ismobilejs';
import { useContext, useEffect } from 'react';

import { QrCodeFormMetadata } from 'checkout/backend/payments';
import { LocaleContext, PaymentConditionsContext, PaymentContext, PaymentModelContext } from 'checkout/contexts';
import { PaymentInteractionRequested, PaymentStarted } from 'checkout/paymentCondition';
import { isNil } from 'checkout/utils';
import { findMetadata } from 'checkout/utils/findMetadata';

import { QRCode } from './QrCode';

const isQrCodeRedirect = (formMetadata: QrCodeFormMetadata) =>
    !isNil(formMetadata) &&
    (isMobile(window.navigator).phone || isMobile(window.navigator).tablet) &&
    formMetadata.qrCodeRedirect === 'mobile';

export function QrCodeView() {
    const { l } = useContext(LocaleContext);
    const { conditions } = useContext(PaymentConditionsContext);
    const {
        paymentModel: { serviceProviders, initContext },
    } = useContext(PaymentModelContext);
    const { startWaitingPaymentResult } = useContext(PaymentContext);

    const { provider } = conditions.find((c) => c.name === 'paymentStarted') as PaymentStarted;
    const { qrCodeForm } = findMetadata(serviceProviders, provider);
    const { interaction } = conditions.find((c) => c.name === 'interactionRequested') as PaymentInteractionRequested;
    if (interaction.type !== 'PaymentInteractionQRCode') throw new Error('Invalid interaction type');

    useEffect(() => {
        isQrCodeRedirect(qrCodeForm) && window.open(interaction.qrCode, '_self');
        startWaitingPaymentResult();
    }, []);

    const { onCopy, hasCopied } = useClipboard(interaction.qrCode);
    const toast = useToast();

    useEffect(() => {
        if (!hasCopied) return;
        toast({
            title: l['form.button.copied.label'],
            status: 'success',
            variant: 'subtle',
            duration: 3000,
        });
    }, [hasCopied, l]);

    return (
        <VStack align="stretch" spacing={5}>
            {qrCodeForm && (
                <>
                    {qrCodeForm.isCopyCodeBlock && (
                        <>
                            <Input defaultValue={interaction.qrCode} id="qr-code-input" readOnly={true}></Input>
                            <LightMode>
                                <Button borderRadius="xl" colorScheme="brand" size="lg" onClick={onCopy}>
                                    {l['form.button.copy.label']}
                                </Button>
                            </LightMode>
                            <Divider />
                        </>
                    )}
                    <Text fontWeight="medium" textAlign="center">
                        {l['form.qr.code']}
                    </Text>
                    <QRCode text={interaction.qrCode} />
                    {initContext.redirectUrl && (
                        <>
                            <Divider />
                            <LightMode>
                                <Button
                                    borderRadius="xl"
                                    colorScheme="brand"
                                    size="lg"
                                    variant="link"
                                    onClick={() => window.open(initContext.redirectUrl, '_self')}
                                >
                                    {l['form.button.back.to.website']}
                                </Button>
                            </LightMode>
                        </>
                    )}
                </>
            )}
        </VStack>
    );
}
