import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";

import { interval, Observable } from "rxjs";

import { createCounter, encodeData, setSession } from "../../../../shared/functions";
import { SocketClient } from "../../../../shared/services/socket-client.service";
import { SocketController } from "../../../../shared/classes/socket-controller";
import { GameListService } from "./services/game-list.service";
import { STATUS } from "../../../../shared/constants";
import { gameList } from "../../../../shared/games";
import { SliderSnackbarDirection } from "./enums";
import { IGameList } from "./interfaces";
import { IMPORTS } from "./imports";
import { SERVICES } from "./services";

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [IMPORTS],
  providers: [SERVICES],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent extends SocketController implements OnInit, OnChanges {
  @Input({ required: true }) timer!: Observable<number> | null;
  showGameList: boolean = false;
  isDisabledGameList: boolean = false;
  private chosenGame = {
    gameNameHostUsernameChose: '',
    gameNamePartnerUsername: ''
  };
  private gameList: Array<IGameList> = [...gameList];
  currentGames!: any;
  private currentIndex = 1;

  get directions() {
    return Object.keys(this.currentGames);
  }

  constructor(
    protected readonly injector: Injector,
    private readonly gameListService: GameListService
  ) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timer']['currentValue'] === null) this.activateGameList();
  }

  ngOnInit() {
    this.currentGames = this.checkCurrentStatusGameList();
  }

  private getLeftIndex() {
    return this.currentIndex === 0 ? this.gameList.length - 1 : this.currentIndex - 1;
  }

  private getRightIndex() {
    return this.currentIndex === this.gameList.length - 1 ? 0 : this.currentIndex + 1;
  }

  prevSlide() {
    this.currentIndex = this.getLeftIndex();
    this.currentGames = this.checkCurrentStatusGameList();
  }

  nextSlide() {
    this.currentIndex = this.getRightIndex();
    this.currentGames = this.checkCurrentStatusGameList();
  }

  private checkCurrentStatusGameList() {
    const gameItemStructure = (direction: SliderSnackbarDirection) => {
      const gameItemDirection = {
        [SliderSnackbarDirection.Left]: this.getLeftIndex(),
        [SliderSnackbarDirection.Center]: this.currentIndex,
        [SliderSnackbarDirection.Right]: this.getRightIndex()
      }
      const currentGame = this.gameList[gameItemDirection[direction]];

      return {
        showPartnerSliderSnackbar: this.chosenGame['gameNamePartnerUsername'] === currentGame?.url,
        showHostSliderSnackbar: this.chosenGame['gameNameHostUsernameChose'] === currentGame?.url,
        gameName: currentGame?.name,
        gameIcon: currentGame?.icon,
        gameUrl: currentGame?.url,
        direction
      }
    }

    return {
      left: gameItemStructure(SliderSnackbarDirection.Left),
      center: gameItemStructure(SliderSnackbarDirection.Center),
      right: gameItemStructure(SliderSnackbarDirection.Right),
    }
  }

  private activateGameList() {
    this.showGameList = true;
    this.gameListService.listenerGameRoom(this.selectGame.bind(this), this.navigateToGame.bind(this));
  }

  handleEmitGameName(gameUrl: string) {
    this.gameListService.emitGameRoom(this.hostUsername, this.roomJoined, gameUrl);
  }

  private selectGame(socketChoseGame: string, gameUrl: string) {
    ((socketChoseGame === this.hostUsername) && (this.chosenGame.gameNameHostUsernameChose = gameUrl));
    ((socketChoseGame === this.partnerUsername) && (this.chosenGame.gameNamePartnerUsername = gameUrl));
    this.currentGames = this.checkCurrentStatusGameList();
  }

  private navigateToGame(gameUrl: string) {
    if (this.chosenGame.gameNameHostUsernameChose === this.chosenGame.gameNamePartnerUsername) {
      this.isDisabledGameList = true;

      interval(1000).subscribe(() => this.showGameList = false);

      this.timer = createCounter(1000, 6, false, () => {
        setSession(STATUS.GAME_ROOM, encodeData(STATUS.GAME_ROOM));
        this.router.navigateByUrl(gameUrl);
      });
    }
  }
}
