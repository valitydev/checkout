import { useCallback } from 'react';
import styled from 'styled-components';

import { Locale } from 'checkout/locale';

import { ReactComponent as ChevronLeftIcon } from '../icon/chevron-left.svg';

const Container = styled.div`
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
`;

const ChevronLeft = styled(ChevronLeftIcon)`
    height: 16px;
    width: 16px;
`;

const Label = styled.p`
    font-weight: 500;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
    margin: 0;
`;

export const Back = ({ locale }: { locale: Locale }) => {
    const back = useCallback(() => window.history.back(), []);
    return (
        <Container onClick={back}>
            <ChevronLeft />
            <Label>{locale['info.back']}</Label>
        </Container>
    );
};
