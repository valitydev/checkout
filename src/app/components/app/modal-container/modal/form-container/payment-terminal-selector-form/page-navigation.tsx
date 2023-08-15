import * as React from 'react';
import styled from 'styled-components';

import { ChevronButton } from 'checkout/components';

const Flex = styled.div`
    display: flex;
    flex-direction: row;
    gap: 16px;
`;

const PageCounter = styled.div`
    user-select: none;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    margin: 0;
`;

type PageNavigationProps = {
    page: number;
    totalPages: number;
    isPrevious: boolean;
    isNext: boolean;
    next: () => void;
    previous: () => void;
};

export const PageNavigation = ({ previous, next, page, totalPages, isNext, isPrevious }: PageNavigationProps) => (
    <Flex>
        <ChevronButton disabled={!isPrevious} type="left" onClick={previous} />
        <PageCounter>
            {page} / {totalPages}
        </PageCounter>
        <ChevronButton disabled={!isNext} type="right" onClick={next} />
    </Flex>
);
