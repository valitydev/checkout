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
    InvoiceChangeType,
    InvoiceEvent,
    PaymentInteractionRequested,
    PaymentResourcePayer,
    PaymentStarted,
    PaymentToolDetails,
    PaymentToolDetailsPaymentTerminal,
    PaymentToolDetailsType,
    Redirect
} from 'checkout/backend';
import { SelectEffect } from 'redux-saga/effects';
import last from 'lodash-es/last';
import { findChange } from 'checkout/utils';

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
    switch (paymentToolDetails.detailsType) {
        case PaymentToolDetailsType.PaymentToolDetailsPaymentTerminal:
            return new ModalForms([new RedirectFormInfo(userInteraction.request)], true);
        default:
            return toModalInteraction(userInteraction);
    }
};

const provideRedirect = (userInteraction: Redirect, paymentToolDetails: PaymentToolDetails): ModalState => {
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

const getPaymentToolDetails = (events: InvoiceEvent[]): PaymentToolDetails => {
    const paymentStarted = findChange<PaymentStarted>(events, 'PaymentStarted');
    const payer = paymentStarted && (paymentStarted?.payment?.payer as PaymentResourcePayer);
    return payer && payer?.paymentToolDetails;
};

export function* provideInteraction(
    events: InvoiceEvent[]
): IterableIterator<ModalForms | ModalInteraction | SelectEffect> {
    const lastEvent = last(events);
    const change = last(lastEvent.changes);
    if (change.changeType !== InvoiceChangeType.PaymentInteractionRequested) {
        throw { code: 'error.wrong.event' };
    }
    const { userInteraction } = change as PaymentInteractionRequested;
    const paymentToolDetails = getPaymentToolDetails(events);
    switch (userInteraction.interactionType) {
        case InteractionType.Redirect:
            return provideRedirect(userInteraction as Redirect, paymentToolDetails);
        default:
            throw { code: 'error.unsupported.user.interaction.type' };
    }
}
