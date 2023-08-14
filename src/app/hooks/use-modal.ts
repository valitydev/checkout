import { useCallback, useReducer } from 'react';
import {
    FormInfo,
    ModalForms,
    ModalName,
    ModalState,
    Named,
    PaymentMethodsFormInfo,
    PaymentStatus,
    SlideDirection,
} from './modal/types';

import { PaymentMethod } from './init-app';
import { InteractionModel, provideInteraction, toInitialState } from './modal';
import { InitConfig } from 'checkout/config';
import { findNamed } from 'checkout/utils';
import { ServiceProvider } from 'checkout/backend';

type State = ModalState[];

export enum Direction {
    back = 'back',
    forward = 'forward',
}

type Action =
    | { type: 'TO_INTERACTION_STATE'; payload: ModalState }
    | { type: 'TO_INITIAL_STATE'; payload: PaymentMethod[] }
    | {
          type: 'GO_TO_FORM_INFO';
          payload: {
              formInfo: FormInfo;
              direction: Direction;
          };
      }
    | {
          type: 'PREPARE_TO_PAY';
      }
    | {
          type: 'SET_VIEW_INFO_ERROR';
          payload: boolean;
      }
    | {
          type: 'PREPARE_TO_RETRY';
          payload: boolean;
      }
    | {
          type: 'FORGET_PAYMENT_ATTEMPT';
      };

const clone = <T>(items: T[]): T[] => JSON.parse(JSON.stringify(items));

const deactivate = (items: Named[]): Named[] =>
    items.map((item) => {
        item.active = false;
        return item;
    });

const add = (items: Named[], item: Named): Named[] => {
    let result = items ? clone(items) : [];
    result = result.length > 0 && item.active ? deactivate(result) : result;
    result.push(item);
    return result;
};

const update = (items: Named[], item: Named, position: number): Named[] => {
    let result = clone(items);
    result = item.active ? deactivate(result) : result;
    result[position] = item;
    return result;
};

const addOrUpdate = (items: Named[], item: Named): Named[] => {
    const index = items ? items.findIndex((current) => current.name === item.name) : -1;
    return index === -1 ? add(items, item) : update(items, item, index);
};

const toSlideDirection = (direction: Direction): SlideDirection => {
    switch (direction) {
        case Direction.forward:
            return SlideDirection.right;
        case Direction.back:
            return SlideDirection.left;
    }
};

const updateFound = (s: ModalState[], found: ModalForms, formInfo: FormInfo, direction: Direction): ModalState[] => {
    return addOrUpdate(s, {
        ...found,
        active: true,
        viewInfo: {
            ...found.viewInfo,
            inProcess: false,
            slideDirection: toSlideDirection(direction),
        },
        formsInfo: addOrUpdate(found.formsInfo, {
            ...formInfo,
            active: true,
        } as FormInfo),
    } as ModalForms);
};

const goToFormInfo = (s: ModalState[], formInfo: FormInfo, direction: Direction): ModalState[] => {
    const modalForms = findNamed(s, ModalName.modalForms) as ModalForms;
    const initial = [new ModalForms([formInfo], true)];
    return modalForms ? updateFound(s, modalForms, formInfo, direction) : initial;
};

const setActiveToPristine = (s: ModalState[]): ModalState[] => {
    const modal = findNamed(s, ModalName.modalForms) as ModalForms;
    const started = modal.formsInfo.find((item) => item.paymentStatus === PaymentStatus.started);
    return started
        ? addOrUpdate(s, {
              ...modal,
              formsInfo: addOrUpdate(modal.formsInfo, {
                  ...started,
                  paymentStatus: PaymentStatus.pristine,
              } as FormInfo),
          } as ModalForms)
        : s;
};

const prepareToPay = (s: ModalState[]): ModalState[] => {
    const modal = findNamed(s, ModalName.modalForms) as ModalForms;
    const active = modal.formsInfo.find((item) => item.active);
    return addOrUpdate(setActiveToPristine(s), {
        ...modal,
        viewInfo: {
            ...modal.viewInfo,
            inProcess: true,
        },
        formsInfo: addOrUpdate(modal.formsInfo, {
            ...active,
            paymentStatus: PaymentStatus.started,
        } as FormInfo),
    } as ModalForms);
};

const updateViewInfo = (s: ModalState[], field: string, value: any): ModalState[] => {
    const modal = findNamed(s, ModalName.modalForms) as ModalForms;
    return addOrUpdate(s, {
        ...modal,
        viewInfo: {
            ...modal.viewInfo,
            [field]: value,
        },
    } as ModalForms);
};

const findStarted = (info: FormInfo[]) => info.find((item) => item.paymentStatus === PaymentStatus.started);

const prepareToRetry = (s: ModalState[], toPristine: boolean): ModalState[] => {
    const modal = findNamed(s, ModalName.modalForms) as ModalForms;
    const started = findStarted(modal.formsInfo);
    return addOrUpdate(s, {
        ...modal,
        viewInfo: {
            ...modal.viewInfo,
            slideDirection: SlideDirection.left,
        },
        formsInfo: addOrUpdate(modal.formsInfo, {
            ...started,
            paymentStatus: toPristine ? PaymentStatus.pristine : PaymentStatus.needRetry,
            active: true,
        } as FormInfo),
    } as ModalForms);
};

const forgetPaymentAttempt = (s: ModalState[]) => {
    const modal = findNamed(s, ModalName.modalForms) as ModalForms;
    const pristine = addOrUpdate(modal.formsInfo, {
        ...findStarted(modal.formsInfo),
        paymentStatus: PaymentStatus.pristine,
        active: false,
    } as FormInfo);
    return addOrUpdate(s, {
        ...modal,
        viewInfo: {
            ...modal.viewInfo,
            slideDirection: SlideDirection.left,
            inProcess: false,
        },
        formsInfo: addOrUpdate(pristine, new PaymentMethodsFormInfo()),
    } as ModalForms);
};

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'TO_INITIAL_STATE':
            return addOrUpdate(state, toInitialState(action.payload));
        case 'GO_TO_FORM_INFO':
            const { formInfo, direction } = action.payload;
            return goToFormInfo(state, formInfo, direction);
        case 'PREPARE_TO_PAY':
            return prepareToPay(state);
        case 'SET_VIEW_INFO_ERROR':
            return updateViewInfo(state, 'error', action.payload);
        case 'PREPARE_TO_RETRY':
            return prepareToRetry(state, action.payload);
        case 'FORGET_PAYMENT_ATTEMPT':
            return forgetPaymentAttempt(state);
        case 'TO_INTERACTION_STATE':
            return addOrUpdate(state, action.payload);
    }
};

const init = (integrationType: InitConfig['integrationType'], availablePaymentMethods: PaymentMethod[]): State => {
    switch (integrationType) {
        case 'invoice':
            return [new ModalForms([], true, true)];
        case 'invoiceTemplate':
            return [toInitialState(availablePaymentMethods)];
    }
};

type ModalParams = {
    integrationType: InitConfig['integrationType'];
    availablePaymentMethods: PaymentMethod[];
    serviceProviders: ServiceProvider[];
};

export const useModal = ({ integrationType, availablePaymentMethods, serviceProviders }: ModalParams) => {
    const [modalState, dispatch] = useReducer(dataReducer, init(integrationType, availablePaymentMethods));

    const toInitialState = useCallback(() => {
        dispatch({ type: 'TO_INITIAL_STATE', payload: availablePaymentMethods });
    }, [availablePaymentMethods]);

    const goToFormInfo = useCallback((formInfo: FormInfo, direction: Direction = Direction.forward) => {
        dispatch({ type: 'GO_TO_FORM_INFO', payload: { formInfo, direction } });
    }, []);

    const prepareToPay = useCallback(() => {
        dispatch({ type: 'PREPARE_TO_PAY' });
    }, []);

    const prepareToRetry = useCallback((resetFormData: boolean) => {
        dispatch({ type: 'PREPARE_TO_RETRY', payload: resetFormData });
    }, []);

    const forgetPaymentAttempt = useCallback(() => {
        dispatch({ type: 'FORGET_PAYMENT_ATTEMPT' });
    }, []);

    const setViewInfoError = useCallback((hasError: boolean) => {
        dispatch({ type: 'SET_VIEW_INFO_ERROR', payload: hasError });
    }, []);

    const toInteractionState = useCallback(
        (interactionModel: InteractionModel) => {
            dispatch({ type: 'TO_INTERACTION_STATE', payload: provideInteraction(serviceProviders, interactionModel) });
        },
        [serviceProviders],
    );

    return {
        modalState,
        toInitialState,
        goToFormInfo,
        prepareToPay,
        prepareToRetry,
        forgetPaymentAttempt,
        setViewInfoError,
        toInteractionState,
    };
};
