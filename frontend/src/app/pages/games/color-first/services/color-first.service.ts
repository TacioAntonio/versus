import { Injectable } from "@angular/core";

import { Socket } from "socket.io-client";
import { SocketClient } from "../../../../shared/services/socket-client.service";

@Injectable()
export class ColorFirstService {
  private _io!: Socket;

  constructor(private readonly socketClient: SocketClient) {
    this._io = this.socketClient.socket_connection;
  }

  emitCollectResponse(hostUsername: string, roomJoined: string, response: string) {
    this._io.emit('optionChosen', hostUsername, roomJoined, response.toLowerCase());
  }

  listenerOptionChosen(listenerOptionChosen: (socketChoseGame: string, option: string) => void) {
    this._io.on('onOptionChosen', listenerOptionChosen);
  }
}
