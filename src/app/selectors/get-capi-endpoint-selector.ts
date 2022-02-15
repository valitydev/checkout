import { State } from 'checkout/state';

export const getCapiEndpointSelector = ({ config }: State) => config.appConfig.capiEndpoint;
