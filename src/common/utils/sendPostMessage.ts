export const sendPostMessage = (message: 'onSuccess' | 'onError' | 'onBack' | 'onProgress') => {
    window.top.postMessage(message, '*');
    console.info(`${message} message sent`);
};
