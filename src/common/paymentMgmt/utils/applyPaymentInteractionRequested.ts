import { InteractionType, QrCodeDisplayRequest, Redirect, UserInteraction } from 'checkout/backend';

import { Interaction, PaymentInteractionRequested } from '../../paymentCondition';

const toInteraction = (userInteraction: UserInteraction): Interaction => {
    switch (userInteraction.interactionType) {
        case InteractionType.Redirect:
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

export const applyPaymentInteractionRequested = (
    userInteraction: UserInteraction,
    provider: string | null,
): PaymentInteractionRequested => ({
    name: 'interactionRequested',
    provider,
    interaction: toInteraction(userInteraction),
});
