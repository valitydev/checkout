import { SberbankIcon, TinkoffIcon, RaiffeisenIcon, SBPIcon } from '../icons';

export const getGatewayIcon = (gatewayName: string, defaultIcon?: JSX.Element): JSX.Element => {
    switch (gatewayName) {
        case 'sberbank':
        case 'Сбербанк':
            return <SberbankIcon />;
        case 'tinkoff':
            return <TinkoffIcon />;
        case 'raiffeisen':
            return <RaiffeisenIcon />;
        case 'sbp':
            return <SBPIcon />;
        default:
            return defaultIcon;
    }
};
