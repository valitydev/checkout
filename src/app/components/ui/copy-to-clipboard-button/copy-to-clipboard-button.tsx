import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import { InitialContext } from 'checkout/components/app/initial-context';

import { Button } from '../button';

export const CopyToClipboardButton: React.FC<{
    onClick: () => void;
    timeout?: number;
}> = ({ timeout = 3000, onClick }) => {
    const { locale } = useContext(InitialContext);
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
