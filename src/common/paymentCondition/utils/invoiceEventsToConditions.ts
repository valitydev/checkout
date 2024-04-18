import { InvoiceEvent, PaymentStarted, UserInteraction } from 'checkout/backend/payments';
import { isNil } from 'checkout/utils';

import { Interaction, PaymentCondition } from '../types';

const getProvider = (started: PaymentStarted): string | null => {
    const paymentToolDetails = started.payment.payer.paymentToolDetails;
    if (paymentToolDetails.detailsType === 'PaymentToolDetailsPaymentTerminal') {
        return paymentToolDetails.provider;
    }
    return null;
};

const toInteraction = (userInteraction: UserInteraction, skipUserInteraction: boolean): Interaction | null => {
    switch (userInteraction.interactionType) {
        case 'Redirect':
            if (skipUserInteraction) {
                return null;
            }
            return {
                type: 'PaymentInteractionRedirect',
                request: userInteraction.request,
            };
        case 'QrCodeDisplayRequest':
            return {
                type: 'PaymentInteractionQRCode',
                qrCode: userInteraction.qrCode,
            };
        case 'ApiExtensionRequest':
            return {
                type: 'PaymentInteractionApiExtension',
            };
    }
};

export const invoiceEventsToConditions = (
    events: InvoiceEvent[],
    skipUserInteraction: boolean,
    isInstantPayment: boolean,
): PaymentCondition[] => {
    return events.reduce((result, { changes, id }) => {
        const conditions = changes.reduce((acc, change) => {
            switch (change.changeType) {
                case 'PaymentStarted': {
                    return [
                        ...acc,
                        {
                            name: 'paymentStarted',
                            eventId: id,
                            provider: getProvider(change),
                            paymentId: change.payment.id,
                            isInstantPayment,
                        },
                    ];
                }
                case 'PaymentStatusChanged': {
                    return [
                        ...acc,
                        {
                            name: 'paymentStatusChanged',
                            eventId: id,
                            status: change.status,
                            paymentId: change.paymentID,
                            error: change?.error,
                        },
                    ];
                }
                case 'PaymentInteractionRequested': {
                    const interaction = toInteraction(change.userInteraction, skipUserInteraction);
                    if (isNil(interaction)) {
                        return acc;
                    }
                    return [
                        ...acc,
                        {
                            name: 'interactionRequested',
                            eventId: id,
                            interaction: toInteraction(change.userInteraction, skipUserInteraction),
                            paymentId: change.paymentID,
                        },
                    ];
                }
                case 'PaymentInteractionCompleted': {
                    return [
                        ...acc,
                        {
                            name: 'interactionCompleted',
                            eventId: id,
                            paymentId: change.paymentID,
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
