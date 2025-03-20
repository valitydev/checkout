import { SberbankIcon, TinkoffIcon, RaiffeisenIcon, SBPIcon, DushanbeCityIcon, VtbIcon } from '../icons';

export const getGatewayIcon = (gatewayName: string, defaultIcon?: JSX.Element): JSX.Element => {
    switch (gatewayName.toLowerCase()) {
        case 'sberbank':
        case 'сбер':
        case 'sber':
        case 'сбербанк':
        case 'сбр':
        case 'sbr':
            return <SberbankIcon />;
        case 'tinkoff':
            return <TinkoffIcon />;
        case 'raiffeisen':
            return <RaiffeisenIcon />;
        case 'sbp':
            return <SBPIcon />;
        case 'душанбе сити':
            return <DushanbeCityIcon />;
        case 'банк втб':
        case 'втб':
        case 'vtb':
            return <VtbIcon />;
        default:
            return defaultIcon;
    }
};
