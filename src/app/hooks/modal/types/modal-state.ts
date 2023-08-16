import { Named } from './named';

export enum ModalName {
    modalInteraction = 'modalInteraction',
    modalForms = 'modalForms',
}

export abstract class ModalState implements Named {
    name: ModalName | string;
    active: boolean;
}
