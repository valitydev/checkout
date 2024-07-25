import { HiViewGrid } from 'react-icons/hi';

import { Pane, PaneLogoBox, PaneLogo, PaneText } from 'checkout/components';

export type TerminalSelectorPaneProps = {
    category: string;
    onClick: () => void;
};

export function TerminalSelectorPane({ onClick, category }: TerminalSelectorPaneProps) {
    return (
        <Pane onClick={onClick}>
            <PaneLogoBox>
                <PaneLogo as={HiViewGrid} />
            </PaneLogoBox>
            <PaneText>{category}</PaneText>
        </Pane>
    );
}
