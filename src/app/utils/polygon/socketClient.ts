import { EventEmitter } from 'events';
import * as _ from 'lodash';

export class SocketClient extends EventEmitter {

  subscriptions: any;
  ws: any;
  apiKey: any;
  connected: any;

  constructor(params: any) {
    super()
    this.subscriptions = []
    this.ws = null
    console.log('Polygon WebSocket class initialized..')
    this.apiKey = params.apiKey
    this.connect()
  }

  subscribe(channels: any) {
    // Add to our list of subscriptions:
    this.subscriptions.push([channels])
    this.subscriptions = _.flatten(this.subscriptions)
    // If these are additional subscriptions, only send the new ones:
    if (this.connected) this.sendSubscriptions(_.flatten([channels]))
  }
  connect() {
    this.connected = false
    this.ws = new WebSocket('wss://socket.polygon.io/stocks')
    this.ws.onopen = this.onOpen.bind(this)
    this.ws.onclose = this.onDisconnect.bind(this)
    this.ws.onerror = this.onError.bind(this)
    this.ws.onmessage = this.onMessage.bind(this)
  }
  onOpen() {
    // Authenticate:
    this.ws.send(`{"action":"auth","params":"${this.apiKey}"}`)
    this.connected = true
    // Subscribe to Crypto Trades and SIP:
    this.sendSubscriptions(this.subscriptions)
  }
  sendSubscriptions(subscriptions: any) {
    if (subscriptions.length == 0) return
    this.ws.send(`{"action":"subscribe","params":"${subscriptions.join(',')}"}`)
  }
  onDisconnect() {
    setTimeout(this.connect.bind(this), 2000)
  }
  onError(e: any) {
    console.log('Error:', e)
  }
  onMessage(msg: any) {
    let data = msg.data
    data = JSON.parse(data)
    data.map((msg: any) => {
      if (msg.ev === 'status') {
        console.log('Status Update:', msg.message)
      }
      this.emit(msg.ev, msg)
    })
  }

}
