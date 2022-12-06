import styled from 'checkout/styled-components';

export const PaymentMethodTitle = styled.div`
    font-weight: 900;
    text-transform: uppercase;
    font-size: 11px;
    color: ${({ theme }) => theme.paymentMethodItem.color};
    letter-spacing: 2px;
    line-height: 15px;
    padding: 0;
    margin: 0;
    display: inline-table;
`;
