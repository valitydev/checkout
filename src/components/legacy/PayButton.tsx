import styled from 'styled-components';

import { Locale } from 'checkout/locale';

import { Button } from './Button';
import { ViewAmount } from '../ViewContainer';

const PayButtonWrapper = styled(Button)`
    margin-top: 20px;
`;

export type PayButtonProps = {
    l: Locale;
    viewAmount: ViewAmount;
};

export const PayButton = ({ l, viewAmount }: PayButtonProps) => (
    <PayButtonWrapper color="primary" id="pay-btn" type="submit">
        {l['form.button.pay.label']} {viewAmount}
    </PayButtonWrapper>
);
