import { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';

import { PageNavigation } from './PageNavigation';
import { ServiceProviderPane } from './ServiceProviderPane';
import { useGridPages } from './useGrigPages';
import { LocaleContext, PaymentModelContext } from '../../../../common/contexts';
import { Input } from '../../../legacy';
import { TerminalSelectorItem } from '../../types';

const GridContainer = styled.div`
    height: 312px;
    width: 100%;
`;

const Grid = styled.div`
    width: 100%;
    display: grid;
    grid-gap: 16px;
    grid-template-columns: 1fr 1fr;
`;

const Flex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
`;

const ITEMS_ON_PAGE = 8;

export type ServiceProvidersGridProps = {
    items: TerminalSelectorItem[];
    onPaneClick(provider: string): void;
};

export function ServiceProvidersGrid({ onPaneClick, items }: ServiceProvidersGridProps) {
    const { l } = useContext(LocaleContext);
    const {
        paymentModel: { serviceProviders },
    } = useContext(PaymentModelContext);

    const [{ totalPages, page, isNext, isPrevious, pageItems }, { next, previous, filter }] = useGridPages(
        items,
        serviceProviders,
        ITEMS_ON_PAGE,
    );
    const isSearchAvailable = useMemo(() => items.length > ITEMS_ON_PAGE, [serviceProviders]);
    const placeholder = useMemo(() => `${l['form.serviceProvidersGrid.search']}...`, []);

    const onChange = useCallback((e) => {
        filter(e.target.value);
    }, []);

    return (
        <Flex>
            {isSearchAvailable && <Input placeholder={placeholder} onChange={onChange} />}
            <GridContainer>
                <Grid>
                    {pageItems.map((gridItem, i) => (
                        <ServiceProviderPane key={i} gridItem={gridItem} onClick={onPaneClick} />
                    ))}
                </Grid>
            </GridContainer>
            {totalPages > 1 && (
                <PageNavigation
                    isNext={isNext}
                    isPrevious={isPrevious}
                    next={next}
                    page={page}
                    previous={previous}
                    totalPages={totalPages}
                />
            )}
        </Flex>
    );
}
