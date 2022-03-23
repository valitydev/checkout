import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getActiveModalFormSelector } from 'checkout/selectors';
import { RedirectFormInfo } from 'checkout/state';
import { Button } from 'checkout/components';
import { prepareForm } from 'checkout/utils';
import { finishInteraction } from 'checkout/actions';

export const RedirectForm: React.FC = () => {
    const containerRef = useRef(null);
    const [form, setForm] = useState(null);
    const origin = useAppSelector((s) => s.config.origin);
    const { request } = useAppSelector<RedirectFormInfo>(getActiveModalFormSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const prepared = prepareForm(origin, request, '_blank');
        containerRef.current.appendChild(prepared);
        setForm(prepared);
    }, []);

    const redirect = () => {
        form.submit();
        dispatch(finishInteraction());
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
