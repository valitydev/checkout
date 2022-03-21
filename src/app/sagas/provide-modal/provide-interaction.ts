import { EventInteractionObject, ModalForms, ModalInteraction, ModalInteractionType } from 'checkout/state';
import { InteractionType, PaymentInteractionRequested, Redirect } from 'checkout/backend';
import { SelectEffect } from 'redux-saga/effects';

export function* provideInteraction(
    change: PaymentInteractionRequested
): IterableIterator<ModalForms | ModalInteraction | SelectEffect> {
    const { userInteraction } = change;
    switch (userInteraction.interactionType) {
        case InteractionType.Redirect:
            return new ModalInteraction(
                {
                    type: ModalInteractionType.EventInteraction,
                    request: (userInteraction as Redirect).request
                } as EventInteractionObject,
                true
            );
        default:
            throw { code: 'error.unsupported.user.interaction.type' };
    }
}
