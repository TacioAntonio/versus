import { Injectable } from '@angular/core';

import { Socket } from 'socket.io-client';

import { SocketClient } from '../../../shared/services/socket-client.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private _io!: Socket;

  constructor(private readonly socketClient: SocketClient) {
    this._io = this.socketClient.socket_connection;
  }

  listenerUsername(collectUsername: (username: string) => void) {
    this._io.on('username', collectUsername);
  }

  listenerConnectedUsers(collectConnectedUsers: (connectedUsers: Array<string>) => void) {
    this._io.on('connectedUsers', collectConnectedUsers);
  }

  emitJoinRoom() {
    this._io.emit('joinRoom');
  }
}
