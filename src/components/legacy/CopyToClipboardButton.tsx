import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button } from './Button';
import { Locale } from '../../common/contexts';

export const CopyToClipboardButton: React.FC<{
    onClick: () => void;
    timeout?: number;
    l: Locale;
}> = ({ timeout = 3000, onClick, l }) => {
    const [label, setLabel] = useState(l['form.button.copy.label']);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLabel(l['form.button.copy.label']);
        }, timeout);
        return () => clearTimeout(timer);
    }, [label]);

    const handleOnClick = () => {
        onClick();
        setLabel(l['form.button.copied.label']);
    };

    return (
        <Button id="copy-to-clipboard-btn" onClick={() => handleOnClick()}>
            {label}
        </Button>
    );
};
