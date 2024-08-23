import { Router } from "@angular/router";

import { Socket } from "socket.io-client";

import { SocketClient } from "../services/socket-client.service";
import { deleteSession, getSession, setSession } from "../functions";
import { STATUS } from "../constants";

export abstract class SocketController {
  _io!: Socket;

  get hostUsername() {
    return getSession(STATUS.USERNAME);
  }

  get partnerUsername() {
    return getSession(STATUS.PARTNER_USERNAME);
  }

  get roomJoined() {
    return getSession(STATUS.ROOM_JOINED);
  }

  get showDisconnectionWarning() {
    return getSession(STATUS.SHOW_DISCONNECTION_WARNING) || false;
  }

  constructor(
    protected readonly socketClient: SocketClient,
    protected readonly router: Router
  ) {
    this._io = this.socketClient.socket_connection;
  }

  emitDisconnectSocket(socket: string) {
    (socket && this._io.emit('disconnectSocket', socket));
  }

  emitDeleteRoom(roomJoined: string) {
    (roomJoined && this._io.emit('deleteRoom', this.roomJoined));
  }

  handleDisconnectSockets(stage: string) {
    const stages: Record<string, STATUS[]> = {
      'waiting-room': [STATUS.ON_HOLD],
      'game-room': [STATUS.GAME_ROOM]
    };

    const stagesToDelete = stages[stage] || [];

    this.emitDeleteRoom(this.roomJoined);
    this.socketClient.disconnectSocket();
    this.emitDisconnectSocket(this.partnerUsername);
    deleteSession(STATUS.ROOM_JOINED);
    deleteSession(STATUS.PARTNER_USERNAME);
    stagesToDelete.forEach((stage: STATUS) => deleteSession(stage));
  }

  listenerRedirectPartnerUserToHome(stage: string) {
    const stages: Record<string, STATUS[]> = {
      'game-room': [STATUS.GAME_ROOM]
    };
    const stagesToDelete = stages[stage] || [];

    this._io.on('redirectHome', (partnerSocket: string) => {
      if (this.hostUsername === partnerSocket) {
        setSession(STATUS.SHOW_DISCONNECTION_WARNING, 'true');
        deleteSession(STATUS.ROOM_JOINED);
        deleteSession(STATUS.PARTNER_USERNAME);
        stagesToDelete.forEach((stage: STATUS) => deleteSession(stage));
        this.socketClient.disconnectSocket();
        this.router.navigateByUrl('home');
      }
    });
  }
}
