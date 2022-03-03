import * as React from 'react';
import { setViewInfoHeight } from 'checkout/actions';
import { FilteredList } from 'checkout/components';
import styled from 'checkout/styled-components';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { BankLogo } from './bank-logo';
import { ServiceProvider } from 'checkout/backend';

const StyledFilteredList: typeof FilteredList = styled(FilteredList)`
    max-height: 615px;
`;

export const BanksList: React.FC<{ items: ServiceProvider[]; select?: (item: ServiceProvider) => void }> = (props) => {
    const locale = useAppSelector((s) => s.config.locale);
    const dispatch = useAppDispatch();
    return (
        <StyledFilteredList
            placeholder={locale['form.onlineBanking.search']}
            values={props.items}
            filter={(search, { brandName }) => brandName.toLocaleLowerCase().includes(search.toLowerCase().trim())}
            item={({ brandName }, { idx }) => ({
                title: brandName,
                icon: <BankLogo index={idx} />
            })}
            search={() => dispatch(setViewInfoHeight(null))}
            select={(item) => props.select(item)}
        />
    );
};
