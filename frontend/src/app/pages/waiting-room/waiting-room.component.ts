import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { createCounter, deleteSession, setSession } from '../../shared/functions';
import { SocketClient } from '../../shared/services/socket-client.service';
import { SocketController } from '../../shared/classes/socket-controller';
import { WaitingRoomService } from './services/waiting-room.service';
import { STATUS } from '../../shared/constants';
import { IRoomDetails } from './interfaces';
import { IMPORTS } from './imports';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [IMPORTS],
  providers: [WaitingRoomService],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.scss'
})
export class WaitingRoomComponent extends SocketController implements OnInit {
  timer!: Observable<number> | null;

  constructor(
    protected readonly injector: Injector,
    private readonly waitingRoomService: WaitingRoomService
  ) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }

  ngOnInit(): void {
    this.waitingRoomService.listenerJoinRoom(this.listenerJoinRoom.bind(this))
    this.listenerRedirectPartnerUserToHome('waiting-room');
  }

  private listenerJoinRoom(roomDetails: IRoomDetails) {
    const { hostSocket, partnerSocket, roomID } = roomDetails;
    (roomDetails?.roomID && setSession(STATUS.ROOM_JOINED, roomID));
    deleteSession(STATUS.ON_HOLD);
    this.collectPartnerUsername(roomID);
    this.activateCounter();
  }

  private activateCounter() {
    this.timer = createCounter(1000, 6, false, () => this.timer = null);
  }

  private collectPartnerUsername(roomJoined: string) {
    const partnerUsername = roomJoined
      .split('/')
      .filter((currentUsername: string) =>
        !currentUsername.includes(this.hostUsername))[0];

    setSession(STATUS.PARTNER_USERNAME, partnerUsername);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.handleDisconnectSockets('waiting-room');
  }

  @HostListener('window:popstate', ['$event'])
  beforeBackPage() {
    this.handleDisconnectSockets('waiting-room');
  }
}
