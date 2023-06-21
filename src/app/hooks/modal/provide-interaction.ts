import {
    InteractionType,
    PaymentToolDetails,
    PaymentToolDetailsPaymentTerminal,
    PaymentToolDetailsType,
    QrCodeDisplayRequest,
    Redirect,
    ServiceProvider
} from 'checkout/backend';
import { InteractionModel } from './types/interaction-model';
import {
    EventInteractionObject,
    ModalForms,
    ModalInteraction,
    ModalInteractionType,
    ModalState,
    QrCodeInteractionFormInfo,
    RedirectFormInfo
} from 'checkout/hooks';
import isNil from 'checkout/utils/is-nil';
import { getMetadata } from 'checkout/components/ui/metadata/utils/get-metadata';

const toModalInteraction = (userInteraction: Redirect): ModalInteraction =>
    new ModalInteraction(
        {
            type: ModalInteractionType.EventInteraction,
            request: userInteraction.request
        } as EventInteractionObject,
        true
    );

const providePaymentTerminalPaymentTool = (userInteraction: Redirect, serviceProvider: ServiceProvider) => {
    const metadata = getMetadata(serviceProvider);
    if (metadata?.userInteraction?.type === 'frame') {
        return toModalInteraction(userInteraction);
    }
    return new ModalForms([new RedirectFormInfo(userInteraction.request)], true, true);
};

const provideRedirect = (userInteraction: Redirect, activeServiceProvider: ServiceProvider | null): ModalState => {
    if (isNil(activeServiceProvider)) {
        // Temporary disable modal interaction
        // return toModalInteraction(userInteraction);
        return new ModalForms([new RedirectFormInfo(userInteraction.request)], true, true);
    }
    return providePaymentTerminalPaymentTool(userInteraction, activeServiceProvider);
};

const provideQrCode = (
    userInteraction: QrCodeDisplayRequest,
    activeServiceProvider: ServiceProvider | null
): ModalForms => {
    let providerID = null;
    if (activeServiceProvider) {
        providerID = activeServiceProvider.id;
    }
    const formInfo = new QrCodeInteractionFormInfo(userInteraction, providerID);
    return new ModalForms([formInfo], true);
};

const getActiveServiceProvider = (
    serviceProviders: ServiceProvider[],
    paymentToolDetails: PaymentToolDetails
): ServiceProvider | null => {
    if (paymentToolDetails.detailsType === PaymentToolDetailsType.PaymentToolDetailsPaymentTerminal) {
        const provider = (paymentToolDetails as PaymentToolDetailsPaymentTerminal).provider;
        return serviceProviders.find((p) => p.id === provider);
    }
    return null;
};

export const provideInteraction = (
    serviceProviders: ServiceProvider[],
    { paymentToolDetails, userInteraction }: InteractionModel
): ModalState => {
    const activeServiceProvider = getActiveServiceProvider(serviceProviders, paymentToolDetails);
    switch (userInteraction.interactionType) {
        case InteractionType.Redirect:
            return provideRedirect(userInteraction as Redirect, activeServiceProvider);
        case InteractionType.QrCodeDisplayRequest:
            return provideQrCode(userInteraction as QrCodeDisplayRequest, activeServiceProvider);
    }
};
