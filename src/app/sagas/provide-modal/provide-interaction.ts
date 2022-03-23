import {
    EventInteractionObject,
    ModalForms,
    ModalInteraction,
    ModalInteractionType,
    ModalState,
    RedirectFormInfo
} from 'checkout/state';
import {
    InteractionType,
    PaymentInteractionRequested,
    PaymentToolDetails,
    PaymentToolDetailsPaymentTerminal,
    PaymentToolDetailsType,
    Redirect
} from 'checkout/backend';
import { SelectEffect } from 'redux-saga/effects';

const toModalInteraction = (userInteraction: Redirect): ModalInteraction =>
    new ModalInteraction(
        {
            type: ModalInteractionType.EventInteraction,
            request: userInteraction.request
        } as EventInteractionObject,
        true
    );

const providePaymentTerminalPaymentTool = (
    userInteraction: Redirect,
    paymentToolDetails: PaymentToolDetailsPaymentTerminal
) => {
    switch (paymentToolDetails.provider) {
        case 'India UPI': // TODO add typing for this
            return new ModalForms([new RedirectFormInfo(userInteraction.request)], true);
        default:
            return toModalInteraction(userInteraction);
    }
};

const provideRedirect = (userInteraction: Redirect, paymentToolDetails?: PaymentToolDetails): ModalState => {
    if (!paymentToolDetails) {
        return toModalInteraction(userInteraction);
    }
    switch (paymentToolDetails.detailsType) {
        case PaymentToolDetailsType.PaymentToolDetailsPaymentTerminal:
            return providePaymentTerminalPaymentTool(
                userInteraction,
                paymentToolDetails as PaymentToolDetailsPaymentTerminal
            );
        default:
            return toModalInteraction(userInteraction);
    }
};

export function* provideInteraction(
    change: PaymentInteractionRequested,
    paymentToolDetails?: PaymentToolDetails
): IterableIterator<ModalForms | ModalInteraction | SelectEffect> {
    const { userInteraction } = change;
    switch (userInteraction.interactionType) {
        case InteractionType.Redirect:
            return provideRedirect(userInteraction as Redirect, paymentToolDetails);
        default:
            throw { code: 'error.unsupported.user.interaction.type' };
    }
}
