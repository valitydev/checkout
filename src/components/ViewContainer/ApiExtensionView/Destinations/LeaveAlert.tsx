import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react';
import { useContext, useRef } from 'react';

import { LocaleContext, PaymentModelContext } from 'checkout/contexts';

export type LeaveAlertProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function LeaveAlert({ isOpen, onClose }: LeaveAlertProps) {
    const { l } = useContext(LocaleContext);
    const cancelRef = useRef();
    const {
        paymentModel: { initContext },
    } = useContext(PaymentModelContext);

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} motionPreset="slideInBottom" onClose={onClose}>
            <AlertDialogOverlay />
            <AlertDialogContent borderRadius="xl">
                <AlertDialogHeader>{l['leave.alert.header']}</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>{l['leave.alert.body']}</AlertDialogBody>
                <AlertDialogFooter>
                    <Button ref={cancelRef} borderRadius="xl" onClick={onClose}>
                        {l['leave.alert.footer.button.no']}
                    </Button>
                    <Button borderRadius="xl" ml={4} onClick={() => window.open(initContext.redirectUrl, '_self')}>
                        {l['leave.alert.footer.button.yes']}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
