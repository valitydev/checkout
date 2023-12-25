import { useEffect } from 'react';
import styled from 'styled-components';

import { Button } from 'checkout/components/ui';
import { useComplete } from 'checkout/hooks/p2p';
import isNil from 'checkout/utils/is-nil';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export type CompletePaymentProps = {
    capiEndpoint: string;
    invoiceAccessToken: string;
    invoiceID: string;
    paymentID: string;
    onCompleteStatusChanged?: (status: string) => void;
};

export const CompletePayment = ({
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
            <Button color="primary" onClick={complete}>
                Complete payment
            </Button>
            {status === 'FAILURE' && <div>An error ocurred</div>}
        </Container>
    );
};
