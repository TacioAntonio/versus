import { Injectable } from "@angular/core";

import { Socket, io } from 'socket.io-client';

import { URL_API } from "../../../environments/environment";

@Injectable()
export class SocketClient {
  private _socket!: Socket | null;

  constructor() {}

  get socket_connection(): Socket {
    if (!this._socket) {
      this._socket = io(URL_API);
    }

    return this._socket;
  }

  disconnectSocket() {
    this._socket = null;
  }
}
