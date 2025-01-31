import { Button, Input, useToast } from '@chakra-ui/react';
import { Base64 } from 'js-base64';
import { useContext, useRef } from 'react';

import { LocaleContext } from 'checkout/contexts';

type Base64Data = string;

export type UploadFileButtonProps = {
    isLoading: boolean;
    loadingText: string;
    onUpload: (data: Base64Data) => void;
};

export function UploadFileButton({ isLoading, loadingText, onUpload }: UploadFileButtonProps) {
    const { l } = useContext(LocaleContext);
    const toast = useToast();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            toast({
                title: 'Invalid file type',
                description: 'Upload a PDF file',
                status: 'error',
                variant: 'subtle',
                duration: 3000,
            });
            return;
        }
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
            toast({
                title: 'File too large',
                description: 'Please upload a PDF file smaller than 10MB',
                status: 'error',
                variant: 'subtle',
                duration: 3000,
            });
            return;
        }
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Base64.fromUint8Array(new Uint8Array(arrayBuffer));
        onUpload(base64String);
    };

    return (
        <>
            <Input ref={fileInputRef} accept=".pdf" display="none" type="file" onChange={handleFileUpload} />
            <Button
                borderRadius="xl"
                colorScheme="brand"
                isLoading={isLoading}
                loadingText={loadingText}
                size="lg"
                onClick={() => fileInputRef.current?.click()}
            >
                {l['form.p2p.attach.button']}
            </Button>
        </>
    );
}
