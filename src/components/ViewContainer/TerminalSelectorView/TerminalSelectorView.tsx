import { VStack, SimpleGrid, Input, Flex, Text } from '@chakra-ui/react';
import { useContext, useMemo } from 'react';

import { BackwardBox } from 'checkout/components';
import { LocaleContext, PaymentModelContext, ViewModelContext } from 'checkout/contexts';

import { PageNavigation } from './PageNavigation';
import { ServiceProviderPane } from './ServiceProviderPane';
import { useGridPages } from './useGrigPages';

const ITEMS_ON_PAGE = 6;

export function TerminalSelectorView() {
    const { l } = useContext(LocaleContext);
    const {
        paymentModel: { serviceProviders },
    } = useContext(PaymentModelContext);
    const {
        viewModel: { views, activeViewId, hasBackward },
        backward,
        forward,
    } = useContext(ViewModelContext);

    const view = views.get(activeViewId);
    if (view.name !== 'TerminalSelectorView') {
        throw new Error(`Wrong View. Expected: PaymentMethodSelectorView, actual: ${view.name}`);
    }

    const [{ totalPages, page, isNext, isPrevious, pageItems }, { next, previous, filter }] = useGridPages(
        view.items,
        serviceProviders,
        ITEMS_ON_PAGE,
    );

    const isSearchAvailable = useMemo(() => view.items.length > ITEMS_ON_PAGE, [serviceProviders]);

    const onChange = (e) => {
        filter(e.target.value);
    };

    return (
        <VStack align="stretch" minH="sm" spacing={5}>
            <Flex alignItems="center">
                {hasBackward && <BackwardBox onClick={backward} />}
                <Text fontWeight="medium" textAlign="center" width="full">
                    {l['form.header.payment.methods.label']}
                </Text>
            </Flex>
            {isSearchAvailable && <Input placeholder={l['form.serviceProvidersGrid.search']} onChange={onChange} />}
            <SimpleGrid columns={[1, 2, 2]} spacing={5}>
                {pageItems.map(({ logo, brandName, viewId }, i) => (
                    <ServiceProviderPane key={i} logo={logo} text={brandName} onClick={() => forward(viewId)} />
                ))}
            </SimpleGrid>
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
        </VStack>
    );
}
