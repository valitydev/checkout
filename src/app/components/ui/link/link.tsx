import styled from 'styled-components';

export const Link = styled.a`
    font-weight: 900;
    font-size: 11px;
    color: ${({ theme }) => theme.linkButton.color};
    letter-spacing: 2px;
    line-height: 15px;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.linkButton.hover};
    }
`;
