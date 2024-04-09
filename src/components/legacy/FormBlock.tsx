import styled from 'styled-components';

import { device } from '../../common/utils';

export const FormBlock = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 16px;

    background: ${({ theme }) => theme.form.background};

    @media ${device.desktop} {
        width: 768px;
        flex-direction: row;
        padding: 30px;
    }
`;
