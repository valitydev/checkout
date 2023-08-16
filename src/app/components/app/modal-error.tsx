import * as React from 'react';
import { useMemo } from 'react';
import styled from 'styled-components';

import { device } from 'checkout/utils/device';

const ModalErrorWrapper = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background: #fff;
    padding: 48px;
    box-sizing: border-box;

    @media ${device.desktop} {
        max-height: 690px;
        width: 680px;
        position: relative;
        border-radius: 16px;
    }
`;

const Title = styled.h2`
    font-size: 16px;
    text-align: center;
    font-weight: 500;
    margin: 0;
    color: ${({ theme }) => theme.font.primaryColor};
`;

const Message = styled.p`
    margin: 0;
    padding-top: 24px;
    font-size: 12px;
    color: ${({ theme }) => theme.font.primaryColor};
`;

const isObject = (value: unknown): value is object => typeof value === 'object' && value !== null;

interface ModalErrorProps {
    error: unknown;
}

export const ModalError: React.FC<ModalErrorProps> = ({ error }) => {
    const errorMessage = useMemo(() => {
        if (error instanceof Error) {
            return `${error.name}: ${error.message}`;
        } else if (isObject(error)) {
            return JSON.stringify(error);
        }
        return 'Unknown error';
    }, [error]);

    return (
        <ModalErrorWrapper>
            <Title>Initialization failure</Title>
            <Message>{errorMessage}</Message>
        </ModalErrorWrapper>
    );
};
