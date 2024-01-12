import { useEffect } from 'react';
import styled from 'styled-components';

import { Button } from 'checkout/components/ui';
import { useComplete } from 'checkout/hooks/p2p';
import { Locale } from 'checkout/locale';
import isNil from 'checkout/utils/is-nil';

import { Info } from './common-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export type CompletePaymentProps = {
    locale: Locale;
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentID: string;
    onCompleteStatusChanged?: (status: string) => void;
};

export const CompletePayment = ({
    locale,
    capiEndpoint,
    invoiceAccessToken,
    invoiceID,
    paymentID,
    onCompleteStatusChanged,
}: CompletePaymentProps) => {
    const {
        state: { status },
        complete,
    } = useComplete(capiEndpoint, invoiceAccessToken, invoiceID, paymentID);

    useEffect(() => {
        if (isNil(onCompleteStatusChanged)) return;
        onCompleteStatusChanged(status);
    }, [status]);

    return (
        <Container>
            <Info>{locale['form.p2p.complete.info']}</Info>
            <Button color="primary" onClick={complete}>
                {locale['form.p2p.complete.button']}
            </Button>
            {status === 'FAILURE' && <div>{locale['form.p2p.error']}</div>}
        </Container>
    );
};
