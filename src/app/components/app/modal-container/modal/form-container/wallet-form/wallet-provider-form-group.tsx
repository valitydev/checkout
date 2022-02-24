import * as React from 'react';
import { KnownDigitalWalletProviders } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';
import { FormGroup } from '../form-group';
import { SticpayAccount } from './fields';

export const WalletProviderFormGroup: React.FC<{ provider: KnownDigitalWalletProviders }> = (props) => {
    switch (props.provider) {
        case KnownDigitalWalletProviders.Sticpay:
            return (
                <FormGroup>
                    <SticpayAccount />
                </FormGroup>
            );
        default:
            assertUnreachable(props.provider);
    }
};
