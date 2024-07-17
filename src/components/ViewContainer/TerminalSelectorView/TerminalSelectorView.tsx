import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
    VStack,
    Text,
    SimpleGrid,
    Center,
    Image,
    Input,
    IconButton,
    Flex,
    Square,
    useColorModeValue,
} from '@chakra-ui/react';
import { useContext, useMemo } from 'react';
import { HiOutlineCash } from 'react-icons/hi';

import { ServiceProviderIconMetadata } from 'checkout/backend/payments/serviceProviderMetadata';
import { BackwardBox } from 'checkout/components';
import { LocaleContext, PaymentModelContext, ViewModelContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { useGridPages } from './useGrigPages';

type MetadataLogoBoxProps = {
    logo?: ServiceProviderIconMetadata;
    height: number;
};

function MetadataLogoBox({ logo, height }: MetadataLogoBoxProps) {
    const bgColor = useColorModeValue('blackAlpha.50', 'gray.100');

    return (
        <Center bgColor={bgColor} borderRadius="md" height={height} p={2} userSelect="none">
            {!isNil(logo) && <Image height={logo.height} src={logo.src} width={logo.width} />}
            {isNil(logo) && <Square as={HiOutlineCash} color="gray.800" size={12} />}
        </Center>
    );
}

type ServiceProviderPaneProps = {
    logo?: ServiceProviderIconMetadata;
    text: string;
    onClick: () => void;
};

function ServiceProviderPane({ text, logo, onClick }: ServiceProviderPaneProps) {
    const hoverBorderColor = useColorModeValue('gray.300', 'whiteAlpha.400');

    return (
        <VStack
            _hover={{ borderColor: hoverBorderColor }}
            align="stretch"
            border="1px"
            borderColor="chakra-border-color"
            borderRadius="lg"
            cursor="pointer"
            p={2}
            spacing={2}
            onClick={onClick}
        >
            <MetadataLogoBox height={16} logo={logo} />
            <Text
                fontWeight="medium"
                overflow="hidden"
                textAlign="center"
                textOverflow="ellipsis"
                userSelect="none"
                whiteSpace="nowrap"
            >
                {text}
            </Text>
        </VStack>
    );
}

type PageNavigationProps = {
    page: number;
    totalPages: number;
    isPrevious: boolean;
    isNext: boolean;
    next: () => void;
    previous: () => void;
};

function PageNavigation({ previous, next, page, totalPages, isNext, isPrevious }: PageNavigationProps) {
    return (
        <Flex alignItems="center" gap={2} justifyContent="center" minWidth="max-content">
            <IconButton
                aria-label="Previous"
                colorScheme="gray"
                fontSize={24}
                icon={<ChevronLeftIcon />}
                isDisabled={!isPrevious}
                size="sm"
                variant="ghost"
                onClick={previous}
            />
            <Text>
                {page} / {totalPages}
            </Text>
            <IconButton
                aria-label="Next"
                colorScheme="gray"
                fontSize={24}
                icon={<ChevronRightIcon />}
                isDisabled={!isNext}
                size="sm"
                variant="ghost"
                onClick={next}
            />
        </Flex>
    );
}

const ITEMS_ON_PAGE = 3;

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
        <VStack align="stretch" spacing={5}>
            {hasBackward && <BackwardBox onClick={backward} />}
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
