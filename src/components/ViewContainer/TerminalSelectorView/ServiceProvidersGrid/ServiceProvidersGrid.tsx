import { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';

import { PageNavigation } from './PageNavigation';
import { ServiceProviderPane } from './ServiceProviderPane';
import { useGridPages } from './useGrigPages';
import { LocaleContext, PaymentModelContext } from '../../../../common/contexts';
import { Input } from '../../../legacy';

const GridContainer = styled.div`
    height: 312px;
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
    onPaneClick(provider: string): void;
};

export function ServiceProvidersGrid({ onPaneClick }: ServiceProvidersGridProps) {
    const { l } = useContext(LocaleContext);
    const {
        paymentModel: { serviceProviders },
    } = useContext(PaymentModelContext);

    const [{ totalPages, page, isNext, isPrevious, pageItems }, { next, previous, filter }] = useGridPages(
        serviceProviders,
        ITEMS_ON_PAGE,
    );
    const isSearchAvailable = useMemo(() => serviceProviders.length > ITEMS_ON_PAGE, [serviceProviders]);
    const placeholder = useMemo(() => `${l['form.serviceProvidersGrid.search']}...`, []);

    const onChange = useCallback((e) => {
        filter(e.target.value);
    }, []);

    return (
        <Flex>
            {isSearchAvailable && <Input placeholder={placeholder} onChange={onChange} />}
            <GridContainer>
                <Grid>
                    {pageItems.map((p, i) => (
                        <ServiceProviderPane key={i} serviceProvider={p} onClick={onPaneClick} />
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
