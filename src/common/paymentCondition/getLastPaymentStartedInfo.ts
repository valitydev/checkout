import {
    InvoiceChangeType,
    InvoiceEvent,
    PaymentInteractionCompleted,
    PaymentInteractionRequested,
    PaymentResourcePayer,
    PaymentStarted,
    PaymentStatusChanged,
    PaymentToolDetailsPaymentTerminal,
    PaymentToolDetailsType,
    UserInteraction,
} from 'checkout/backend';

import { isNil } from '../utils';

export type LastPaymentStartedInfo = {
    userInteraction?: UserInteraction;
    provider?: string;
    paymentId?: string;
};

const getProvider = (started: PaymentStarted): string | null => {
    const payer = (started as PaymentStarted).payment.payer;
    const paymentToolDetails = (payer as PaymentResourcePayer).paymentToolDetails;
    if (paymentToolDetails.detailsType === PaymentToolDetailsType.PaymentToolDetailsPaymentTerminal) {
        return (paymentToolDetails as PaymentToolDetailsPaymentTerminal).provider;
    }
    return null;
};

export const getLastPaymentStartedInfo = (events: InvoiceEvent[]): LastPaymentStartedInfo =>
    events.reduce((result, event) => {
        const started = event.changes.find(({ changeType }) => changeType === InvoiceChangeType.PaymentStarted);
        if (!isNil(started)) {
            result = {
                ...result,
                paymentId: (started as PaymentStarted).payment.id,
                provider: getProvider(started as PaymentStarted),
            };
        }

        const interaction = event.changes.find(
            ({ changeType }) => changeType === InvoiceChangeType.PaymentInteractionRequested,
        );
        if (!isNil(interaction)) {
            const interactionRequested = interaction as PaymentInteractionRequested;
            if (result.paymentId !== interactionRequested.paymentID) {
                return result;
            }
            result = {
                ...result,
                userInteraction: interactionRequested.userInteraction,
            };
        }

        const interactionCompleted = event.changes.find(
            ({ changeType }) => changeType === InvoiceChangeType.PaymentInteractionCompleted,
        );
        if (!isNil(interactionCompleted)) {
            const interactionCompleted = interaction as PaymentInteractionCompleted;
            if (result.paymentId !== interactionCompleted.paymentID) {
                return result;
            }
            result = {
                ...result,
                userInteraction: null,
            };
        }

        const statusChanged = event.changes.find(
            ({ changeType }) => changeType === InvoiceChangeType.PaymentStatusChanged,
        );
        if (!isNil(statusChanged)) {
            const paymentStatusChanged = statusChanged as PaymentStatusChanged;
            if (result.paymentId === paymentStatusChanged.paymentID) {
                return {};
            }
            return result;
        }

        return result;
    }, {} as LastPaymentStartedInfo);
