import * as React from 'react';

import { Header } from '../header';
import { useAppSelector } from 'checkout/configure-store';
import { getCurrentModalFormSelector } from 'checkout/selectors/get-current-modal-form-selector';
import { OnlineBankingAccountFormInfo } from 'checkout/state';
import { FormGroup } from 'checkout/components/app/modal-container/modal/form-container/form-group';
import { Input } from 'checkout/components';
import styled from 'checkout/styled-components';
import { ReactSVG } from 'react-svg';

const BankLogoWrapper = styled.div`
    margin: auto;
`;
const StyledLogo = styled(ReactSVG)`
    svg {
        width: auto;
        height: 48px;
        margin-bottom: 20px;
    }
`;

export const OnlineBankingAccountForm: React.FC = () => {
    const locale = useAppSelector((s) => s.config.locale);
    const formInfo = useAppSelector(getCurrentModalFormSelector) as OnlineBankingAccountFormInfo;
    const { serviceProvider } = formInfo;

    return (
        !!serviceProvider?.metadata && (
            <form>
                <Header title={serviceProvider.brandName} />
                {!!serviceProvider.metadata.logo && (
                    <BankLogoWrapper>
                        <StyledLogo src={serviceProvider.metadata.logo.src} />
                    </BankLogoWrapper>
                )}
                {!!serviceProvider.metadata.form &&
                    serviceProvider.metadata.form.map((field) => (
                        <FormGroup>
                            <Input name={field.name} placeholder={locale['form.pay.onlineBanking.' + field.name]} />
                        </FormGroup>
                    ))}
            </form>
        )
    );
};
