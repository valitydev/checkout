import * as React from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from 'checkout/configure-store';
import { getLocaleSelector } from 'checkout/selectors';
import { Button } from '../button';

export const CopyToClipboardButton: React.FC<{ data: string; timeout?: number }> = ({ data, timeout = 3000 }) => {
    const locale = useAppSelector(getLocaleSelector);
    const [label, setLabel] = useState(locale['form.button.copy.label']);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLabel(locale['form.button.copy.label']);
        }, timeout);
        return () => clearTimeout(timer);
    }, [label]);

    const copyToClipboard = (qrCode: string) => {
        navigator.clipboard.writeText(qrCode);
        setLabel(locale['form.button.copied.label']);
    };

    return <Button onClick={() => copyToClipboard(data)}>{label}</Button>;
};
