import { Component, HostListener, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { SocketController } from '../../../shared/classes/socket-controller';
import { SocketClient } from '../../../shared/services/socket-client.service';
import { ColorFirstService } from './services/color-first.service';
import { createCounter } from '../../../shared/functions';
import { OPTIONS } from './color-first-options';
import { IMPORTS } from './imports';

@Component({
  selector: 'app-color-fist',
  standalone: true,
  imports: [IMPORTS],
  providers: [ColorFirstService],
  templateUrl: './color-fist.component.html'
})
export class ColorFirstComponent extends SocketController implements OnInit {
  timerForInstructions!: Observable<number> | null;
  showDialogInstructions = true;
  withActionButton = true;
  usersPoints: any = {
    host: 0,
    partner: 0
  };
  resultIndicator: string | null = null;
  private rounds = 0;
  private currentOption = OPTIONS[this.rounds];

  get option(): any {
    return this.currentOption;
  }

  get currentResponse(): any {
    return this.currentOption?.question?.response.toLowerCase();
  }

  set option(option: number) {
    this.currentOption = OPTIONS[option];
  }

  constructor(
    protected readonly injector: Injector,
    private readonly colorFirstService: ColorFirstService
  ) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }

  ngOnInit(): void {
    this.listenerRedirectPartnerUserToHome('game-room');
    this.activateCounter();
    this.colorFirstService.listenerOptionChosen(this.listenerOptionChosen.bind(this));
  }

  private activateCounter() {
    this.timerForInstructions = createCounter(1000, 10, false, () => {
      this.timerForInstructions = null;
      this.showDialogInstructions = false;
    });
  }

  collectResponse(value: any) {
    this.colorFirstService.emitCollectResponse(this.hostUsername, this.roomJoined, value);
  }

  private listenerOptionChosen(socketChoseGame: string, option: string) {
    this.updateMatch(socketChoseGame, option);
    this.showScore(this.rounds === OPTIONS.length);
  }

  private updateMatch(socketChoseGame: string, option: string) {
    if (socketChoseGame === this.hostUsername && option === this.currentResponse) {
      this.usersPoints.host++;
      this.incrementRounds();
    } else if (socketChoseGame === this.partnerUsername && option === this.currentResponse) {
      this.usersPoints.partner++;
      this.incrementRounds();
    }
  }

  private incrementRounds() {
    this.rounds++;
    this.option = this.rounds;
  }

  private showScore(stopMatch: boolean) {
    if (!stopMatch) return;

    if (this.usersPoints.host > this.usersPoints.partner) {
      this.resultIndicator = `Winner: ${this.hostUsername}`;
    } else if (this.usersPoints.partner > this.usersPoints.host) {
      this.resultIndicator = `Winner: ${this.partnerUsername}`;
    } else {
      this.resultIndicator = 'Draw!';
    }
  }

  navigateToHome() {
    this.handleDisconnectSockets('game-room');
    this.router.navigateByUrl('/home');
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.handleDisconnectSockets('game-room');
  }

  @HostListener('window:popstate', ['$event'])
  beforeBackPage() {
    this.handleDisconnectSockets('game-room');
  }
}
