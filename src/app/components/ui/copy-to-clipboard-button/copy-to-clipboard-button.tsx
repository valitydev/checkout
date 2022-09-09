import * as React from 'react';
import { useEffect, useState } from 'react';

import { useAppSelector } from 'checkout/configure-store';
import { getLocaleSelector } from 'checkout/selectors';
import { Button } from '../button';

export const CopyToClipboardButton: React.FC<{ onClick: () => void; timeout?: number }> = ({
    timeout = 3000,
    onClick
}) => {
    const locale = useAppSelector(getLocaleSelector);
    const [label, setLabel] = useState(locale['form.button.copy.label']);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLabel(locale['form.button.copy.label']);
        }, timeout);
        return () => clearTimeout(timer);
    }, [label]);

    const handleOnClick = () => {
        onClick();
        setLabel(locale['form.button.copied.label']);
    };

    return (
        <Button id="copy-to-clipboard-btn" onClick={() => handleOnClick()}>
            {label}
        </Button>
    );
};
