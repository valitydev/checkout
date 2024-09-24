export const sendPostMessage = (message: 'onSuccess' | 'onError' | 'onBack') => {
    window.top.postMessage(message);
    console.info(`${message} message sent`);
};
