import * as React from 'react';
import { useEffect } from 'react';
import styled from 'checkout/styled-components';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector, getLocaleSelector } from 'checkout/selectors';
import { QRCode } from './qr-code';
import { QrCodeInteractionFormInfo } from 'checkout/state';
import { finishInteraction } from 'checkout/actions';

const Instruction = styled.p`
    font-weight: 500;
    line-height: 24px;
    text-align: center;
`;

export const QrCodeInteractionForm: React.FC = () => {
    const locale = useAppSelector(getLocaleSelector);
    const { request } = useAppSelector<QrCodeInteractionFormInfo>(getActiveModalFormSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(finishInteraction());
    }, []);

    return (
        <>
            <Instruction>{locale['form.qr.code']}</Instruction>
            <QRCode text={request.qrCode} />
        </>
    );
};
