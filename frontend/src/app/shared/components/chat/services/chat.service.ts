import { Injectable } from "@angular/core";

import { Socket } from "socket.io-client";

import { SocketClient } from "../../../services/socket-client.service";

@Injectable()
export class ChatService {
  private _io!: Socket;

  constructor(private readonly socketClient: SocketClient) {
    this._io = this.socketClient.socket_connection;
  }

  listenerJoinRoom(
    storeMessageInHistory: (socketSendMessage: string, partnerUsername: string, message: string) => void
  ) {
    this._io.on('messageReceived', storeMessageInHistory);
  }

  emitMessage(
    hostUsername: string,
    roomJoined: string,
    partnerUsername: string,
    message: string
  ) {
    if (!roomJoined || !message?.trim()) return;

    this._io.emit('sendMessage', hostUsername, roomJoined, partnerUsername, message);
  }
}
