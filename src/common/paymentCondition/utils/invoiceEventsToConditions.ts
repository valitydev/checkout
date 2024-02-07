import {
    InteractionType,
    InvoiceChangeType,
    InvoiceEvent,
    PaymentInteractionCompleted,
    PaymentInteractionRequested,
    PaymentResourcePayer,
    PaymentStarted,
    PaymentStatusChanged,
    PaymentToolDetailsPaymentTerminal,
    PaymentToolDetailsType,
    QrCodeDisplayRequest,
    Redirect,
    UserInteraction,
} from 'checkout/backend';

import { isNil } from '../../../common/utils';
import { Interaction, PaymentCondition } from '../types';

const getProvider = (started: PaymentStarted): string | null => {
    const payer = (started as PaymentStarted).payment.payer;
    const paymentToolDetails = (payer as PaymentResourcePayer).paymentToolDetails;
    if (paymentToolDetails.detailsType === PaymentToolDetailsType.PaymentToolDetailsPaymentTerminal) {
        return (paymentToolDetails as PaymentToolDetailsPaymentTerminal).provider;
    }
    return null;
};

const toInteraction = (userInteraction: UserInteraction, skipUserInteraction: boolean): Interaction | null => {
    switch (userInteraction.interactionType) {
        case InteractionType.Redirect:
            if (skipUserInteraction) {
                return null;
            }
            return {
                type: 'PaymentInteractionRedirect',
                request: (userInteraction as Redirect).request,
            };
        case InteractionType.QrCodeDisplayRequest:
            return {
                type: 'PaymentInteractionQRCode',
                qrCode: (userInteraction as QrCodeDisplayRequest).qrCode,
            };
        case InteractionType.ApiExtensionRequest:
            return {
                type: 'PaymentInteractionApiExtension',
            };
    }
};

export const invoiceEventsToConditions = (events: InvoiceEvent[], skipUserInteraction: boolean): PaymentCondition[] => {
    return events.reduce((result, { changes, id }) => {
        const conditions = changes.reduce((acc, change) => {
            switch (change.changeType) {
                case InvoiceChangeType.PaymentStarted: {
                    const started = change as PaymentStarted;
                    return [
                        ...acc,
                        {
                            name: 'paymentStarted',
                            eventId: id,
                            provider: getProvider(started),
                            paymentId: started.payment.id,
                        },
                    ];
                }
                case InvoiceChangeType.PaymentStatusChanged: {
                    const statusChanged = change as PaymentStatusChanged;
                    return [
                        ...acc,
                        {
                            name: 'paymentStatusChanged',
                            eventId: id,
                            status: statusChanged.status,
                            paymentId: statusChanged.paymentID,
                            error: statusChanged?.error,
                        },
                    ];
                }
                case InvoiceChangeType.PaymentInteractionRequested: {
                    const interactionRequested = change as PaymentInteractionRequested;
                    const interaction = toInteraction(interactionRequested.userInteraction, skipUserInteraction);
                    if (isNil(interaction)) {
                        return acc;
                    }
                    return [
                        ...acc,
                        {
                            name: 'interactionRequested',
                            eventId: id,
                            interaction: toInteraction(interactionRequested.userInteraction, skipUserInteraction),
                            paymentId: interactionRequested.paymentID,
                        },
                    ];
                }
                case InvoiceChangeType.PaymentInteractionCompleted: {
                    const interactionCompleted = change as PaymentInteractionCompleted;
                    return [
                        ...acc,
                        {
                            name: 'interactionCompleted',
                            eventId: id,
                            paymentId: interactionCompleted.paymentID,
                        },
                    ];
                }
                default:
                    return acc;
            }
        }, []);
        return [...result, ...conditions];
    }, []);
};
