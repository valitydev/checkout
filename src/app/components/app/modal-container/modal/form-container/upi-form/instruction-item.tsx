import styled from 'checkout/styled-components';

export const InstructionItem = styled.div<{ width?: string }>`
    font-weight: 500;
    line-height: 24px;
    margin: 10px 0;
    width: ${(props) => props.width};
`;
