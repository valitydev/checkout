import { Footer } from './footer';
import { FormBlock } from './form-block';
import { FormContainer } from './form-container';
import { Info } from './info';

const Modal = () => (
    <>
        <FormBlock>
            <Info />
            <FormContainer />
        </FormBlock>
        <Footer />
    </>
);

export default Modal;
