import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Alert,
    Box,
    ListItem,
    Text,
    UnorderedList,
    VStack,
} from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext } from 'checkout/contexts';
import { isString } from 'checkout/utils';

import { mapNotification } from '../utils';

function NotificationItemAlert({ content }: { content: string[] }) {
    return (
        <Alert borderRadius="xl" status="warning">
            <VStack align="stretch">
                <UnorderedList>
                    {content.map((value, key) => (
                        <ListItem key={key} fontSize="sm">
                            {value}
                        </ListItem>
                    ))}
                </UnorderedList>
            </VStack>
        </Alert>
    );
}

type NotificationProps = {
    code: string;
};

export function DestinationNotification({ code }: NotificationProps) {
    const { l } = useContext(LocaleContext);
    const notification = mapNotification(code, l);

    const render = () => {
        if (isString(notification)) {
            return (
                <Alert borderRadius="xl" p={3} status="warning">
                    <Text fontSize="sm" whiteSpace="pre-wrap">
                        {notification}
                    </Text>
                </Alert>
            );
        }

        return (
            <Accordion defaultIndex={[0]} pb={5}>
                {notification.map((item, index) => {
                    return (
                        <AccordionItem key={index}>
                            <AccordionButton>
                                <Box as="span" flex="1" textAlign="left">
                                    <Text as="b">{item.title}</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel>
                                <NotificationItemAlert content={item.content} />
                            </AccordionPanel>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        );
    };

    return <>{render()}</>;
}
