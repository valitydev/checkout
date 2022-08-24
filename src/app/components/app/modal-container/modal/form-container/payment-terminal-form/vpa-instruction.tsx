import * as React from 'react';
import styled from 'checkout/styled-components';

import { Locale } from 'checkout/locale';

const InstructionItem = styled.div<{ width?: string }>`
    font-weight: 500;
    line-height: 24px;
    margin: 10px 0;
    width: ${(props) => props.width};
`;

export const VpaInstruction: React.FC<{ locale: Locale }> = ({ locale }) => {
    const items = locale['form.pay.upi.instruction'];
    return (
        <>
            <InstructionItem>{items[0]}</InstructionItem>
            <InstructionItem width="40%">{items[1]}</InstructionItem>
        </>
    );
};
