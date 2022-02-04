import * as React from 'react';
import { connect } from 'react-redux';
import { State } from 'checkout/state';
import { bindActionCreators, Dispatch } from 'redux';
import { setViewInfoHeight } from 'checkout/actions';
import BankIcon from './bank.svg';
import { FilteredList, RoundIcon } from 'checkout/components';
import { ReactNode, useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Theme } from 'checkout/themes';

export interface BankItem {
    name: string;
    icon?: ReactNode;
}

const mapState = (state: State) => ({
    locale: state.config.locale
});
const mapDispatch = (dispatch: Dispatch) => ({
    setViewInfoHeight: bindActionCreators(setViewInfoHeight, dispatch)
});

const BanksListRef: React.FC<{ items: BankItem[] } & ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> = (
    props
) => {
    const themeContext = useContext<Theme>(ThemeContext);

    return (
        <FilteredList
            values={props.items}
            filter={(search, { name }) => name.toLocaleLowerCase().includes(search.toLowerCase().trim())}
            item={({ name }, { idx }) => ({
                title: name,
                icon: (
                    <RoundIcon
                        color={themeContext.color.iconBackgrounds[idx % themeContext.color.iconBackgrounds.length]}>
                        <BankIcon />
                    </RoundIcon>
                )
            })}
            search={() => props.setViewInfoHeight(null)}
        />
    );
};

export const BanksList = connect(mapState, mapDispatch)(BanksListRef);
