import * as React from 'react';

import { Header } from '../header';
import { useAppSelector } from 'checkout/configure-store';
import { getCurrentModalFormSelector } from 'checkout/selectors/get-current-modal-form-selector';
import { OnlineBankingAccountFormInfo } from 'checkout/state';
import { FormGroup } from 'checkout/components/app/modal-container/modal/form-container/form-group';
import { Input } from 'checkout/components';
import Bank from './bank.svg';
import styled from 'checkout/styled-components';

const BankWrapper = styled.div`
    margin: auto;
`;
const StyledBank = styled(Bank)`
    width: auto;
    height: 48px;
    margin-bottom: 20px;
`;

export const OnlineBankingAccountForm: React.FC = () => {
    const locale = useAppSelector((s) => s.config.locale);
    const formInfo = useAppSelector(getCurrentModalFormSelector) as OnlineBankingAccountFormInfo;

    return (
        <form>
            <Header title={formInfo.serviceProvider?.brandName} />
            <BankWrapper>
                <StyledBank />
            </BankWrapper>
            <FormGroup>
                <Input placeholder={locale['form.pay.onlineBanking.bankAccountName']} />
            </FormGroup>
            <FormGroup>
                <Input placeholder={locale['form.pay.onlineBanking.bankAccountNumber']} />
            </FormGroup>
        </form>
    );
};
