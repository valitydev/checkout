import {
    EventInteractionObject,
    ModalForms,
    ModalInteraction,
    ModalInteractionType,
    ModalState,
    QrCodeInteractionFormInfo,
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
    QrCodeDisplayRequest,
    Redirect
} from 'checkout/backend';
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
            return new ModalForms([new RedirectFormInfo(userInteraction.request)], true, true);
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

const provideQrCode = (userInteraction: QrCodeDisplayRequest): ModalForms => {
    const formInfo = new QrCodeInteractionFormInfo(userInteraction);
    return new ModalForms([formInfo], true);
};

export function provideInteraction(events: InvoiceEvent[]): ModalState {
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
        case InteractionType.QrCodeDisplayRequest:
            return provideQrCode(userInteraction as QrCodeDisplayRequest);
        default:
            throw { code: 'error.unsupported.user.interaction.type' };
    }
}
