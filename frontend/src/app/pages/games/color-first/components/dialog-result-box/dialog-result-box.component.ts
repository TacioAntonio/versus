import { Component, EventEmitter, Injector, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

import { SocketClient } from "../../../../../shared/services/socket-client.service";
import { SocketController } from "../../../../../shared/classes/socket-controller";

@Component({
  selector: 'app-dialog-result-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-result-box.component.html',
  styleUrl: './dialog-result-box.component.scss'
})
export class DialogResultBoxComponent extends SocketController {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) hostPoints!: number;
  @Input({ required: true }) partnerPoints!: number;
  @Input({ required: true }) resultIndicator!: string;
  @Input() withActionButton: boolean = false;
  @Input() actionButtonTitle!: string;
  @Output() _emitActionButton = new EventEmitter<any>();

  constructor(protected readonly injector: Injector) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }

  emitActionButton() {
    this._emitActionButton.emit();
  }
}
