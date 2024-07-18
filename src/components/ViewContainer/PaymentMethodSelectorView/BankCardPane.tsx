import { useContext } from 'react';
import { HiCreditCard } from 'react-icons/hi';

import { Pane, PaneLogo, PaneLogoBox, PaneText } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';

export type BankCardPaneProps = {
    onClick: () => void;
};

export function BankCardPane({ onClick }: BankCardPaneProps) {
    const { l } = useContext(LocaleContext);

    return (
        <Pane onClick={onClick}>
            <PaneLogoBox>
                <PaneLogo as={HiCreditCard} />
            </PaneLogoBox>
            <PaneText>{l['form.payment.method.name.card.label']}</PaneText>
        </Pane>
    );
}
