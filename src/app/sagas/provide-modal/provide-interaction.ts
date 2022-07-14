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
    Redirect,
    ServiceProvider
} from 'checkout/backend';
import last from 'lodash-es/last';
import { findChange } from 'checkout/utils';
import { getMetadata } from 'checkout/components/ui';

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
    { provider }: PaymentToolDetailsPaymentTerminal,
    serviceProviders: ServiceProvider[]
) => {
    const serviceProvider = serviceProviders.find((p) => p.id === provider);
    const metadata = getMetadata(serviceProvider);
    if (metadata?.userInteraction?.type === 'frame') {
        return toModalInteraction(userInteraction);
    }
    return new ModalForms([new RedirectFormInfo(userInteraction.request)], true, true);
};

const provideRedirect = (
    userInteraction: Redirect,
    paymentToolDetails: PaymentToolDetails,
    serviceProviders: ServiceProvider[]
): ModalState => {
    if (!paymentToolDetails) {
        return toModalInteraction(userInteraction);
    }
    switch (paymentToolDetails.detailsType) {
        case PaymentToolDetailsType.PaymentToolDetailsPaymentTerminal:
            return providePaymentTerminalPaymentTool(
                userInteraction,
                paymentToolDetails as PaymentToolDetailsPaymentTerminal,
                serviceProviders
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

export function provideInteraction(events: InvoiceEvent[], serviceProviders: ServiceProvider[]): ModalState {
    const lastEvent = last(events);
    const change = last(lastEvent.changes);
    if (change.changeType !== InvoiceChangeType.PaymentInteractionRequested) {
        throw { code: 'error.wrong.event' };
    }
    const { userInteraction } = change as PaymentInteractionRequested;
    const paymentToolDetails = getPaymentToolDetails(events);
    switch (userInteraction.interactionType) {
        case InteractionType.Redirect:
            return provideRedirect(userInteraction as Redirect, paymentToolDetails, serviceProviders);
        case InteractionType.QrCodeDisplayRequest:
            return provideQrCode(userInteraction as QrCodeDisplayRequest);
        default:
            throw { code: 'error.unsupported.user.interaction.type' };
    }
}
