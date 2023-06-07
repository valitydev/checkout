import { useCallback, useReducer } from 'react';
import { FormInfo, ModalForms, ModalName, ModalState, Named, SlideDirection } from 'checkout/state';

import { PaymentMethod } from './init-app';
import { toInitialState } from './modal';
import { InitConfig } from 'checkout/config';
import { findNamed } from 'checkout/utils';

type State = ModalState[];

export enum Direction {
    back = 'back',
    forward = 'forward'
}

export enum PaymentStatus {
    pristine = 'pristine',
    started = 'started',
    needRetry = 'needRetry'
}

type Action =
    | { type: 'SET_MODAL_STATE'; payload: ModalState }
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
            slideDirection: toSlideDirection(direction)
        },
        formsInfo: addOrUpdate(found.formsInfo, {
            ...formInfo,
            active: true
        } as FormInfo)
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
                  paymentStatus: PaymentStatus.pristine
              } as FormInfo)
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
            inProcess: true
        },
        formsInfo: addOrUpdate(modal.formsInfo, {
            ...active,
            paymentStatus: PaymentStatus.started
        } as FormInfo)
    } as ModalForms);
};

const updateViewInfo = (s: ModalState[], field: string, value: any): ModalState[] => {
    const modal = findNamed(s, ModalName.modalForms) as ModalForms;
    return addOrUpdate(s, {
        ...modal,
        viewInfo: {
            ...modal.viewInfo,
            [field]: value
        }
    } as ModalForms);
};

const dataReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_MODAL_STATE':
            return addOrUpdate(state, action.payload);
        case 'GO_TO_FORM_INFO':
            const { formInfo, direction } = action.payload;
            return goToFormInfo(state, formInfo, direction);
        case 'PREPARE_TO_PAY':
            return prepareToPay(state);
        case 'SET_VIEW_INFO_ERROR':
            return updateViewInfo(state, 'error', action.payload);
    }
};

type ModalParams = {
    integrationType: InitConfig['integrationType'];
    availablePaymentMethods: PaymentMethod[];
};

const init = ({ integrationType, availablePaymentMethods }: ModalParams): State => {
    switch (integrationType) {
        case 'invoice':
            return [];
        case 'invoiceTemplate':
            return [toInitialState(availablePaymentMethods)];
    }
};

export const useModal = (params: ModalParams) => {
    const [modalState, dispatch] = useReducer(dataReducer, init(params));

    const goToFormInfo = useCallback((formInfo: FormInfo, direction: Direction = Direction.forward) => {
        dispatch({ type: 'GO_TO_FORM_INFO', payload: { formInfo, direction } });
    }, []);

    const prepareToPay = useCallback(() => {
        dispatch({ type: 'PREPARE_TO_PAY' });
    }, []);

    const setViewInfoError = useCallback((hasError: boolean) => {
        dispatch({ type: 'SET_VIEW_INFO_ERROR', payload: hasError });
    }, []);

    return { modalState, goToFormInfo, prepareToPay, setViewInfoError };
};
