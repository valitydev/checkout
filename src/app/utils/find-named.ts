import { Named } from 'checkout/hooks';

export const findNamed = <I extends Named = Named>(items: I[], name: string): I =>
    items && name ? items.find((item) => item.name === name) : null;
