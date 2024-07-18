import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Text, IconButton, Flex } from '@chakra-ui/react';

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
