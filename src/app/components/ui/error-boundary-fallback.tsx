import styled from 'styled-components';

import { Button } from './button';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 48px;
    background-color: ${({ theme }) => theme.form.background};
`;

const Message = styled.p`
    margin: 0;
    font-size: 16px;
    color: ${({ theme }) => theme.font.primaryColor};
`;

export const ErrorBoundaryFallback = () => (
    <Container>
        <Message>Something went wrong. Try reloading.</Message>
        <Button color="primary" onClick={() => location.reload()}>
            Reload
        </Button>
    </Container>
);
