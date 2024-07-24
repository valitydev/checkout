import { Text, IconButton, Flex } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export type PageNavigationProps = {
    page: number;
    totalPages: number;
    isPrevious: boolean;
    isNext: boolean;
    next: () => void;
    previous: () => void;
};

export function PageNavigation({ previous, next, page, totalPages, isNext, isPrevious }: PageNavigationProps) {
    return (
        <Flex alignItems="center" gap={2} justifyContent="center" minWidth="max-content">
            <IconButton
                aria-label="Previous"
                colorScheme="gray"
                fontSize={24}
                icon={<HiChevronLeft />}
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
                icon={<HiChevronRight />}
                isDisabled={!isNext}
                size="sm"
                variant="ghost"
                onClick={next}
            />
        </Flex>
    );
}
