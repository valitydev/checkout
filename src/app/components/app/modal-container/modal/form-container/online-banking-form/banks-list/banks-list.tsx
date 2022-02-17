import * as React from 'react';
import { setViewInfoHeight } from 'checkout/actions';
import { FilteredList } from 'checkout/components';
import styled from 'checkout/styled-components';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { BankLogo } from '../bank-logo';
import { ServiceProvider } from 'checkout/backend';
import { LOGO_BY_SERVICE_PROVIDER_ID } from 'checkout/constants';

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
            item={({ id, brandName }, { idx }) => {
                const logo = LOGO_BY_SERVICE_PROVIDER_ID[id];
                return {
                    title: brandName,
                    icon: <BankLogo index={idx} src={logo?.src} color={logo?.backgroundColor} />
                };
            }}
            search={() => dispatch(setViewInfoHeight(null))}
            select={(item) => props.select(item)}
        />
    );
};
