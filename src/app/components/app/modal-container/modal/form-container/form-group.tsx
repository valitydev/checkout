import styled from 'styled-components';

export const FormGroup = styled.div<{ direction?: 'column' | 'row' }>`
    display: flex;
    flex-wrap: nowrap;
    flex-direction: ${({ direction }) => direction || 'row'};
    margin-bottom: 10px;
`;
