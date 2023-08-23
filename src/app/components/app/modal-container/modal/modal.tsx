import { Footer } from './footer';
import { FormBlock } from './form-block';
import { FormContainer } from './form-container';
import { Info } from './info';

export const Modal = () => (
    <>
        <FormBlock>
            <Info />
            <FormContainer />
        </FormBlock>
        <Footer />
    </>
);
