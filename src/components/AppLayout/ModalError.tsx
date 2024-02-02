import { useMemo } from 'react';
import styled from 'styled-components';

import { device, isNil } from '../../common/utils';
import { Button } from '../legacy';

const ModalErrorWrapper = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background: #fff;
    padding: 32px;
    box-sizing: border-box;

    @media ${device.desktop} {
        max-height: 690px;
        width: 680px;
        position: relative;
        border-radius: 16px;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const Title = styled.h2`
    font-size: 18px;
    text-align: center;
    font-weight: 500;
    margin: 0;
    color: ${({ theme }) => theme.font.primaryColor};
`;

const Message = styled.p`
    margin: 0;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
`;

const isObject = (value: unknown): value is object => typeof value === 'object' && value !== null;

const DEFAULT_MESSAGE = 'Something went wrong. Try reloading.';

const extractError = (error) => {
    const isNotFound = !isNil(error.status) && error.status === 404;
    const errorMessage = error?.details?.message;
    return {
        message: isNil(errorMessage) ? DEFAULT_MESSAGE : errorMessage,
        retryAvailable: !isNotFound,
    };
};

interface ModalErrorProps {
    error: unknown;
}

export function ModalError({ error }: ModalErrorProps) {
    const { message, retryAvailable } = useMemo(() => {
        if (error instanceof Error) {
            return {
                message: `${error.name}: ${error.message}`,
                retryAvailable: true,
            };
        } else if (isObject(error)) {
            return extractError(error);
        }
        return {
            message: DEFAULT_MESSAGE,
            retryAvailable: true,
        };
    }, [error]);

    return (
        <ModalErrorWrapper>
            <Container>
                <Title>Initialization failure</Title>
                <Message>{message}</Message>
                {retryAvailable && (
                    <Button color="primary" onClick={() => location.reload()}>
                        Reload
                    </Button>
                )}
            </Container>
        </ModalErrorWrapper>
    );
}
