import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { RedirectFormInfo } from 'checkout/state';
import { Button } from 'checkout/components';
import { prepareForm } from 'checkout/utils';

export const RedirectForm: React.FC = () => {
    const containerRef = useRef(null);
    const [form, setForm] = useState(null);
    const origin = useAppSelector((s) => s.config.origin);
    const { request } = useAppSelector<RedirectFormInfo>(getActiveModalFormSelector);

    useEffect(() => {
        const prepared = prepareForm(origin, request, '_blank');
        containerRef.current.appendChild(prepared);
        setForm(prepared);
    }, []);

    const redirect = () => {
        form.submit();
    };

    return (
        <>
            <div ref={containerRef}></div>
            <Button type="submit" color="primary" onClick={redirect}>
                Redirect
            </Button>
        </>
    );
};
