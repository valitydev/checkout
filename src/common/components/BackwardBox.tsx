import { Flex, IconButton } from '@chakra-ui/react';
import { HiChevronLeft } from 'react-icons/hi';

export type BackwardButtonProps = {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export function BackwardBox({ onClick }: BackwardButtonProps) {
    return (
        <Flex>
            <IconButton
                aria-label="Back"
                fontSize={24}
                icon={<HiChevronLeft />}
                size="sm"
                variant="ghost"
                onClick={onClick}
            />
        </Flex>
    );
}
