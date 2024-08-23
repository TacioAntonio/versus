import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Injector, Input, Output } from "@angular/core";

import { SocketClient } from "../../../../../shared/services/socket-client.service";
import { SocketController } from "../../../../../shared/classes/socket-controller";
import { Router } from "@angular/router";

@Component({
  selector: 'app-game-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-zone.component.html',
  styleUrl: './game-zone.component.scss'
})
export class GameZoneComponent extends SocketController {
  @Input({ required: true }) option!: any;
  @Input({ required: true }) hostPoints!: number;
  @Input({ required: true }) partnerPoints!: number;
  @Output() _emitCollectResponse = new EventEmitter<any>();

  constructor(protected readonly injector: Injector) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }

  emitCollectResponse(value: any) {
    this._emitCollectResponse.emit(value);
  }
}
