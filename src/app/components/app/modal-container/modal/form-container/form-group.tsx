import styled from 'styled-components';

export const FormGroup = styled.div<{ direction?: 'column' | 'row'; $gap?: number }>`
    display: flex;
    flex-wrap: nowrap;
    flex-direction: ${({ direction }) => direction || 'row'};
    margin-bottom: 10px;
    gap: ${({ $gap }) => `${$gap}px` || 0};
`;
