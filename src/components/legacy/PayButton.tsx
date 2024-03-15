import styled from 'styled-components';

import { Button } from './Button';
import { Locale } from '../../common/contexts';
import { ViewAmount } from '../ViewContainer';

const PayButtonWrapper = styled(Button)`
    margin-top: 24px;
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
