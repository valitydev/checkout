import * as React from 'react';
import { useEffect, useRef } from 'react';
import styled from 'checkout/styled-components';
import isMobile from 'ismobilejs';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import {
    getActiveModalFormSelector,
    getInitConfigSelector,
    getLocaleSelector,
    getServiceProviderSelector
} from 'checkout/selectors';
import { QRCode } from './qr-code';
import { QrCodeInteractionFormInfo } from 'checkout/state';
import { finishInteraction } from 'checkout/actions';
import { Button, CopyToClipboardButton, getMetadata, Hr, Input } from 'checkout/components/ui';
import { QrCodeFormMetadata } from 'checkout/backend';

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

const isQrCodeRedirect = ({ qrCodeRedirect }: QrCodeFormMetadata) =>
    (isMobile(window.navigator).phone || isMobile(window.navigator).tablet) && qrCodeRedirect === 'mobile';

export const QrCodeInteractionForm: React.FC = () => {
    const qrCodeInputRef = useRef(null);
    const locale = useAppSelector(getLocaleSelector);
    const { request, providerID } = useAppSelector<QrCodeInteractionFormInfo>(getActiveModalFormSelector);
    const serviceProvider = useAppSelector(getServiceProviderSelector(providerID));
    const { qrCodeForm } = getMetadata(serviceProvider);
    const initConfig = useAppSelector(getInitConfigSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.info('qrCodeForm metadata', JSON.stringify(qrCodeForm));
        isQrCodeRedirect(qrCodeForm) && window.open(request.qrCode, '_self');
        dispatch(finishInteraction());
    }, []);

    const copyToClipboard = () => {
        qrCodeInputRef.current.select();
        document.execCommand('copy');
    };

    return (
        <Container>
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
                    <Button id="back-to-website-btn" onClick={() => window.open(initConfig.redirectUrl, '_self')}>
                        {locale['form.button.back.to.website']}
                    </Button>
                </>
            )}
        </Container>
    );
};
