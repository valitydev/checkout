import { useEffect, useState } from 'react';

import { InvoiceChange, PaymentInteractionRequested, PaymentResourcePayer, PaymentStarted } from 'checkout/backend';
import { InteractionModel } from 'checkout/hooks';
import isNil from 'checkout/utils/is-nil';

export const useInteractionModel = () => {
    const [paymentInteraction, setPaymentInteraction] = useState<InvoiceChange>(null);
    const [paymentStarted, setPaymentStarted] = useState<InvoiceChange>(null);
    const [interactionModel, setInteractionModel] = useState<InteractionModel>(null);

    useEffect(() => {
        if (isNil(paymentInteraction) || isNil(paymentStarted)) return;
        const userInteraction = (paymentInteraction as PaymentInteractionRequested)?.userInteraction;
        const payer = (paymentStarted as PaymentStarted)?.payment?.payer as PaymentResourcePayer;
        const paymentToolDetails = payer && payer?.paymentToolDetails;
        setInteractionModel({ userInteraction, paymentToolDetails });
    }, [paymentInteraction, paymentStarted]);

    return { interactionModel, setPaymentInteraction, setPaymentStarted };
};
