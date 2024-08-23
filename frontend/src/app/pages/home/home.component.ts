import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { timer } from 'rxjs';

import { deleteSession, encodeData, setSession } from '../../shared/functions';
import { SocketClient } from '../../shared/services/socket-client.service';
import { SocketController } from '../../shared/classes/socket-controller';
import { HomeService } from './services/home.service';
import { STATUS } from '../../shared/constants';
import { IMPORTS } from './imports';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IMPORTS],
  providers: [HomeService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends SocketController implements OnInit {
  connectedUsers!: Array<string>;

  constructor(
    protected readonly injector: Injector,
    private readonly homeService: HomeService
  ) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }

  ngOnInit(): void {
    this.listenerHostUserConnection();
    this.homeService.listenerConnectedUsers(this.collectConnectedUsers.bind(this));

    (this.showDisconnectionWarning && (
      timer(5 * 1000).subscribe(() => deleteSession(STATUS.SHOW_DISCONNECTION_WARNING))
    ));
  }

  private listenerHostUserConnection() {
    const disconnectHostUser = () => {
      (this.hostUsername && (
        this.emitDisconnectSocket(this.hostUsername),
        deleteSession(STATUS.USERNAME)
      ));
    }

    disconnectHostUser();
    this.homeService.listenerUsername(this.collectUsername);
  }

  private collectUsername(username: string) {
    setSession(STATUS.USERNAME, username)
  }

  private collectConnectedUsers(connectedUsers: Array<string>) {
    this.connectedUsers = connectedUsers;
  }

  emitJoinRoom() {
    this.homeService.emitJoinRoom();
    setSession(STATUS.ON_HOLD, encodeData(STATUS.ON_HOLD));
    this.router.navigateByUrl('waiting-room');
  }
}
