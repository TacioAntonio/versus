import { Injectable } from "@angular/core";
import { Socket } from "socket.io-client";
import { SocketClient } from "../../../../../shared/services/socket-client.service";

@Injectable()
export class GameListService {
  private _io!: Socket;

  constructor(
    protected readonly socketClient: SocketClient
  ) {
    this._io = this.socketClient.socket_connection;
  }

  emitGameRoom(hostUsername: string, roomJoined: boolean, gameUrl: string) {
    if (!roomJoined) return;

    this._io.emit('joinGameRoom', hostUsername, roomJoined, gameUrl);
  }


  listenerGameRoom(
    selectGame: (socketChoseGame: string, gameUrl: string) => void,
    navigateToGame: (gameUrl: string) => void
  ) {
    this._io.on('gameRoomJoined', (socketChoseGame: string, gameUrl: string) => {
      selectGame(socketChoseGame, gameUrl);
      navigateToGame(gameUrl);
    });
  }
}
