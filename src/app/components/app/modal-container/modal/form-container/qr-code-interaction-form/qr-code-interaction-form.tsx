import * as React from 'react';
import { useContext, useEffect, useRef } from 'react';
import styled from 'checkout/styled-components';
import isMobile from 'ismobilejs';

import { QRCode } from './qr-code';
import { QrCodeInteractionFormInfo } from 'checkout/hooks';
import { Button, CopyToClipboardButton, getMetadata, Hr, Input } from 'checkout/components/ui';
import { QrCodeFormMetadata } from 'checkout/backend';
import isNil from 'checkout/utils/is-nil';
import { useActiveModalForm } from '../use-active-modal-form';

import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';

const Instruction = styled.p`
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    margin: 0;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const isQrCodeRedirect = (formMetadata: QrCodeFormMetadata) =>
    !isNil(formMetadata) &&
    (isMobile(window.navigator).phone || isMobile(window.navigator).tablet) &&
    formMetadata.qrCodeRedirect === 'mobile';

export const QrCodeInteractionForm = ({ onMount }: { onMount?: () => void }) => {
    const qrCodeInputRef = useRef(null);
    const {
        locale,
        initConfig,
        model: { serviceProviders }
    } = useContext(InitialContext);
    const { modalState } = useContext(ModalContext);
    const { request, providerID } = useActiveModalForm<QrCodeInteractionFormInfo>(modalState);
    const serviceProvider = serviceProviders.find((value) => value.id === providerID);
    const { qrCodeForm } = getMetadata(serviceProvider);

    useEffect(() => {
        isQrCodeRedirect(qrCodeForm) && window.open(request.qrCode, '_self');
        !isNil(onMount) && onMount();
    }, []);

    const copyToClipboard = () => {
        qrCodeInputRef.current.select();
        document.execCommand('copy');
    };

    return (
        <Container>
            {qrCodeForm && (
                <>
                    {qrCodeForm.isCopyCodeBlock && (
                        <>
                            <Input
                                id="qr-code-input"
                                ref={qrCodeInputRef}
                                defaultValue={request.qrCode}
                                readOnly={true}></Input>
                            <CopyToClipboardButton onClick={() => copyToClipboard()} />
                            <Hr />
                        </>
                    )}
                    <Instruction>{locale['form.qr.code']}</Instruction>
                    <QRCode text={request.qrCode} />
                    {initConfig.redirectUrl && (
                        <>
                            <Hr />
                            <Button
                                id="back-to-website-btn"
                                onClick={() => window.open(initConfig.redirectUrl, '_self')}>
                                {locale['form.button.back.to.website']}
                            </Button>
                        </>
                    )}
                </>
            )}
        </Container>
    );
};
