import { InteractionType, QrCodeDisplayRequest, Redirect, UserInteraction } from 'checkout/backend';

import { PaymentCondition, PaymentInteractionRedirectType } from '../../paymentCondition';

export const applyPaymentInteractionRequested = (
    userInteraction: UserInteraction,
    redirectType: PaymentInteractionRedirectType = 'self',
): PaymentCondition => {
    switch (userInteraction.interactionType) {
        case InteractionType.Redirect:
            return {
                name: 'interactionRequested',
                interaction: {
                    type: 'PaymentInteractionRedirect',
                    redirectType,
                    request: (userInteraction as Redirect).request,
                },
            };
        case InteractionType.QrCodeDisplayRequest:
            return {
                name: 'interactionRequested',
                interaction: {
                    type: 'PaymentInteractionQRCode',
                    qrCode: (userInteraction as QrCodeDisplayRequest).qrCode,
                },
            };
        case InteractionType.ApiExtensionRequest:
            return {
                name: 'interactionRequested',
                interaction: {
                    type: 'PaymentInteractionApiExtension',
                },
            };
    }
};
