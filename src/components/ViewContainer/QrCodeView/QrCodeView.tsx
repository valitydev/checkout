import { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { QRCode } from './QrCode';
import { LocaleContext, PaymentConditionsContext, PaymentContext, PaymentModelContext } from '../../../common/contexts';
import { PaymentInteractionRequested, PaymentStarted } from '../../../common/paymentCondition';
import { findMetadata } from '../../../common/utils';
import { Button, CopyToClipboardButton, Hr, Input } from '../../../components/legacy';

const Instruction = styled.p`
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    margin: 0;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export function QrCodeView() {
    const qrCodeInputRef = useRef(null);
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
        startWaitingPaymentResult();
    }, []);

    const copyToClipboard = () => {
        qrCodeInputRef.current.select();
        document.execCommand('copy');
    };

    return (
        <Wrapper>
            {qrCodeForm && (
                <>
                    {qrCodeForm.isCopyCodeBlock && (
                        <>
                            <Input
                                ref={qrCodeInputRef}
                                defaultValue={interaction.qrCode}
                                id="qr-code-input"
                                readOnly={true}
                            ></Input>
                            <CopyToClipboardButton l={l} onClick={() => copyToClipboard()} />
                            <Hr />
                        </>
                    )}
                    <Instruction>{l['form.qr.code']}</Instruction>
                    <QRCode text={interaction.qrCode} />
                    {initContext.redirectUrl && (
                        <>
                            <Hr />
                            <Button
                                id="back-to-website-btn"
                                onClick={() => window.open(initContext.redirectUrl, '_self')}
                            >
                                {l['form.button.back.to.website']}
                            </Button>
                        </>
                    )}
                </>
            )}
        </Wrapper>
    );
}
