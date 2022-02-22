import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    constructor(private socket: Socket) { }

    // emit event
    connectTx(user_id: any, txList?: any[]) {
        console.log('user_id', user_id);

        this.socket.emit('join', { user_id: user_id, txList: txList });
    }

    // listen event
    getTx(user_id: any) {
        console.log('tx_message_' + user_id);
        return this.socket.fromEvent('tx_message_' + user_id);
    }
}