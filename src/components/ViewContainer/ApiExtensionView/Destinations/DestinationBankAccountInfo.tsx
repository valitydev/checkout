import { useContext } from 'react';

import { DestinationBankAccount } from 'checkout/backend/p2p';
import { LocaleContext } from 'checkout/contexts';

import { InfoItem } from './InfoItem';

export type DestinationBankAccountProps = {
    destination: DestinationBankAccount;
};

export function DestinationBankAccountInfo({ destination }: DestinationBankAccountProps) {
    const { l } = useContext(LocaleContext);

    return (
        <>
            <InfoItem
                isCopyable={true}
                label={l['form.p2p.destination.bank.account.account']}
                value={destination.account}
            />
            {destination?.bic && (
                <InfoItem
                    isCopyable={true}
                    label={l['form.p2p.destination.bank.account.bic']}
                    value={destination.bic}
                />
            )}
            {destination?.purpose && (
                <InfoItem
                    isCopyable={true}
                    label={l['form.p2p.destination.bank.account.purpose']}
                    value={destination.purpose}
                />
            )}
        </>
    );
}
