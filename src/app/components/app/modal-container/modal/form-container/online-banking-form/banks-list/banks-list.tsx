import styled from 'checkout/styled-components';
import * as React from 'react';
import { MouseEventHandler, ReactInstance, useEffect, useState } from 'react';
import BankIcon from './bank.svg';
import { FormGroup } from '../../form-group';
import { Input } from 'checkout/components';
import SearchIcon from './search.svg';
import { connect } from 'react-redux';
import { State } from 'checkout/state';
import { bindActionCreators, Dispatch } from 'redux';
import { setViewInfoHeight } from 'checkout/actions';

export interface Bank {
    name: string;
}

const List = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 551px;
    overflow-y: auto;
    margin-top: 20px;

    & > * {
        margin-top: 10px;
        &:first-child {
            margin-top: 0;
        }
    }
`;
const StyledItem = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`;
const StyledTitle = styled.div`
    margin-left: 10px;
    font-weight: 500;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
const IconWrapper = styled.div<{ color: string }>`
    height: 48px;
    width: 48px;
    min-width: 48px;
    background-color: ${({ color }) => color};
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Item: React.FC<{ logo?: ReactInstance; title: string; color?: string; onSelect?: MouseEventHandler<any> }> = ({
    logo,
    title,
    color,
    onSelect
}) => (
    <StyledItem onClick={onSelect}>
        <IconWrapper color={color || '#ccc'}>{logo || <BankIcon />}</IconWrapper>
        <StyledTitle>{title}</StyledTitle>
    </StyledItem>
);

const mapState = (state: State) => ({
    locale: state.config.locale
});
const mapDispatch = (dispatch: Dispatch) => ({
    setViewInfoHeight: bindActionCreators(setViewInfoHeight, dispatch)
});

const BanksListRef: React.FC<{ banks: Bank[] } & ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> = (
    props
) => {
    const [search, setSearch] = useState('');
    const defaultColors = ['#B25AC3', '#54CB59', '#38C1CD', '#5B9FFF', '#CAC557'];
    const filteredBanks = props.banks
        .map((bank, id) => ({ ...bank, id }))
        .filter(({ name }) => name.toLocaleLowerCase().includes(search.toLowerCase().trim()));

    useEffect(() => {
        props.setViewInfoHeight(null);
    }, [search]);

    return (
        <>
            <FormGroup>
                <Input
                    placeholder={props.locale['form.payment.method.name.onlineBanking.search']}
                    icon={<SearchIcon />}
                    onInput={({ currentTarget }) => setSearch(currentTarget.value)}
                />
            </FormGroup>
            {!!filteredBanks.length && (
                <List>
                    {filteredBanks.map(({ name, id }) => (
                        <Item
                            title={name}
                            key={id}
                            color={defaultColors[id % defaultColors.length]}
                            onSelect={() => console.log(props.banks[id])}
                        />
                    ))}
                </List>
            )}
        </>
    );
};

export const BankList = connect(mapState, mapDispatch)(BanksListRef);
