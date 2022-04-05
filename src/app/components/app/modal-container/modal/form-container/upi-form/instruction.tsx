import * as React from 'react';

import { Locale } from 'checkout/locale';
import { InstructionItem } from './instruction-item';

export const Instruction: React.FC<{ locale: Locale }> = ({ locale }) => {
    const items = locale['form.pay.upi.instruction'];
    return (
        <>
            <InstructionItem>{items[0]}</InstructionItem>
            <InstructionItem width="40%">{items[1]}</InstructionItem>
        </>
    );
};
