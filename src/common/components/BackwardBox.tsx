import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';

export type BackwardButtonProps = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export function BackwardBox({ onClick }: BackwardButtonProps) {
    return (
        <Flex>
            <IconButton
                aria-label="Back"
                colorScheme="brand"
                fontSize={24}
                icon={<ChevronLeftIcon />}
                size="sm"
                onClick={onClick}
            />
        </Flex>
    );
}
