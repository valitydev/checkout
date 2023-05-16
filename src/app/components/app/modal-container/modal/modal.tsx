import * as React from 'react';

import { Info } from './info';
import { FormContainer } from './form-container';
import { FormBlock } from './form-block';
import { Footer } from './footer';

export const Modal = () => (
    <>
        <FormBlock id="form-container">
            <Info />
            <FormContainer />
        </FormBlock>
        <Footer />
    </>
);
