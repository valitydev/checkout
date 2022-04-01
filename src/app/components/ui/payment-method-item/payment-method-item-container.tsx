import styled from 'styled-components';

export const PaymentMethodItemContainer = styled.li`
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.neutral[0.2]};
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 80px;
    margin-bottom: 10px;
    transition: all 0.3s;
    :hover {
        border-color: ${({ theme }) => theme.color.primary[1]};
    }
`;
