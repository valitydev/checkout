import { Transport } from './transport';

export class StubTransport implements Transport {
    emit(eventName: string, data?: object) {
        console.info('transport stub emit: ', eventName, data);
    }

    on(eventName: string, callback: (data: object) => void): void {
        callback({});
        console.info('transport stub on: ', eventName, callback);
    }

    destroy() {
        console.info('transport stub destroy');
    }
}
