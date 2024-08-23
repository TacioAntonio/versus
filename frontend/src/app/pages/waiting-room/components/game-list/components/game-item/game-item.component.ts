import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Injector, Input, Output } from "@angular/core";
import { Router } from "@angular/router";

import { SocketController } from "../../../../../../shared/classes/socket-controller";
import { SocketClient } from "../../../../../../shared/services/socket-client.service";
import { SliderSnackbarDirection } from "./enums";

@Component({
  selector: 'app-game-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-item.component.html',
  styleUrl: './game-item.component.scss'
})
export class GameItemComponent extends SocketController {
  @Input({ required: true }) showPartnerSliderSnackbar: boolean = false;
  @Input({ required: true }) showHostSliderSnackbar: boolean = false;
  @Input({ required: true }) currentGameName!: string;
  @Input({ required: true }) currentGameIcon!: string;
  @Input({ required: true }) currentGameUrl!: string;
  @Input({ required: true }) sliderSnackbarDirection!: SliderSnackbarDirection;
  @Output() emitGameNameEvent = new EventEmitter<string>();

  constructor(protected readonly injector: Injector) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }

  emitGameName(gameUrl: string) {
    this.emitGameNameEvent.emit(gameUrl);
  }

  checkDirection(currentDirection: SliderSnackbarDirection) {
    return currentDirection === SliderSnackbarDirection.Center;
  }
}
