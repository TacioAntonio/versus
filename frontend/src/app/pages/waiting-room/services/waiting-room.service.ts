import { Injectable } from "@angular/core";
import { Socket } from "socket.io-client";
import { SocketClient } from "../../../shared/services/socket-client.service";
import { IRoomDetails } from "../interfaces";

@Injectable()
export class WaitingRoomService {
  private _io!: Socket;

  constructor(private readonly socketClient: SocketClient) {
    this._io = this.socketClient.socket_connection;
  }

  listenerJoinRoom(listenerJoinRoom: (roomDetails: IRoomDetails) => void) {
    this._io.on('roomJoined', listenerJoinRoom);
  }
}
