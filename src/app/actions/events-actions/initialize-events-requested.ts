import { TypeKeys } from '../type-keys';
import { Event } from 'checkout/backend';

export const initializeEvents = (events: Event[]) => ({
    type: TypeKeys.EVENTS_INIT_REQUESTED,
    payload: events
});
