import * as React from 'react';
import { useEffect, useRef } from 'react';
import styled from 'checkout/styled-components';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector, getLocaleSelector } from 'checkout/selectors';
import { QRCode } from './qr-code';
import { QrCodeInteractionFormInfo } from 'checkout/state';
import { finishInteraction } from 'checkout/actions';
import { CopyToClipboardButton, Hr, Input } from 'checkout/components/ui';

const Instruction = styled.p`
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    margin: 0;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const QrCodeInteractionForm: React.FC = () => {
    const qrCodeInputRef = useRef(null);
    const locale = useAppSelector(getLocaleSelector);
    const { request } = useAppSelector<QrCodeInteractionFormInfo>(getActiveModalFormSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(finishInteraction());
    }, []);

    const copyToClipboard = () => {
        qrCodeInputRef.current.select();
        document.execCommand('copy');
    };

    return (
        <Container>
            <Input id="qr-code-input" inputRef={qrCodeInputRef} defaultValue={request.qrCode} readOnly={true}></Input>
            <CopyToClipboardButton onClick={() => copyToClipboard()} />
            <Hr />
            <Instruction>{locale['form.qr.code']}</Instruction>
            <QRCode text={request.qrCode} />
        </Container>
    );
};
