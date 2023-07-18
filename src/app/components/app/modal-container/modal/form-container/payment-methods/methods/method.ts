import styled from 'styled-components';

export const Method = styled.li`
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.paymentMethodItem.border};
    padding: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    margin-bottom: 10px;
    transition: all 0.3s;
    cursor: pointer;
    :hover {
        border-color: ${({ theme }) => theme.paymentMethodItem.hover};
    }
`;
