import * as React from 'react';

import { useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { QRCode } from './qr-code';
import { QrCodeInteractionFormInfo } from 'checkout/state';

export const QrCodeInteractionForm: React.FC = () => {
    const { request } = useAppSelector<QrCodeInteractionFormInfo>(getActiveModalFormSelector);
    return (
        <div>
            <QRCode text={request.qrCode} />
        </div>
    );
};
