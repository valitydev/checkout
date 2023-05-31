import * as React from 'react';
import { useContext, useEffect, useRef } from 'react';
import styled from 'checkout/styled-components';
import isMobile from 'ismobilejs';

import { useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { QRCode } from './qr-code';
import { QrCodeInteractionFormInfo } from 'checkout/state';
import { Button, CopyToClipboardButton, getMetadata, Hr, Input } from 'checkout/components/ui';
import { QrCodeFormMetadata, ServiceProvider } from 'checkout/backend';
import isNil from 'checkout/utils/is-nil';

import { InitialContext } from '../../../../initial-context';

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

const getServiceProvider = (serviceProviders: ServiceProvider[], serviceProviderID: string): ServiceProvider =>
    serviceProviders.find((serviceProvider) => serviceProvider.id === serviceProviderID);

export const QrCodeInteractionForm: React.FC = () => {
    const qrCodeInputRef = useRef(null);
    const { locale, initConfig, model } = useContext(InitialContext);

    const { request, providerID } = useAppSelector<QrCodeInteractionFormInfo>(getActiveModalFormSelector);
    const serviceProvider = getServiceProvider(model.serviceProviders, providerID);
    const { qrCodeForm } = getMetadata(serviceProvider);

    useEffect(() => {
        isQrCodeRedirect(qrCodeForm) && window.open(request.qrCode, '_self');
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
                                inputRef={qrCodeInputRef}
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
