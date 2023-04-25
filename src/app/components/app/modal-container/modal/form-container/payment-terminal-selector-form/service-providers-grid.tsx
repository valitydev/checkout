import * as React from 'react';
import styled from 'checkout/styled-components';
import { ServiceProvider } from 'checkout/backend';
import { ServiceProviderPane } from './service-provider-pane';
import { useCallback, useContext, useMemo } from 'react';
import { PageNavigation } from './page-navigation';
import { Input } from 'checkout/components';
import { useGridPages } from './use-grid-pages';
import { InitialContext } from '../../../../initial-context';

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

export interface ServiceProvidersGridProps {
    serviceProviders: ServiceProvider[];
    onPaneClick(serviceProviderId: string): void;
}

export const ServiceProvidersGrid: React.FC<ServiceProvidersGridProps> = ({ serviceProviders, onPaneClick }) => {
    const { locale } = useContext(InitialContext);
    const [{ totalPages, page, isNext, isPrevious, pageItems }, { next, previous, filter }] = useGridPages(
        serviceProviders,
        ITEMS_ON_PAGE
    );

    const onChange = useCallback((e) => {
        filter(e.target.value);
    }, []);

    const isSearchAvailable = useMemo(() => serviceProviders.length > ITEMS_ON_PAGE, [serviceProviders]);
    const placeholder = useMemo(() => `${locale['form.serviceProvidersGrid.search']}...`, []);

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
                    previous={previous}
                    next={next}
                    page={page}
                    totalPages={totalPages}
                    isNext={isNext}
                    isPrevious={isPrevious}
                />
            )}
        </Flex>
    );
};
