import { Component, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

import { SocketController } from "../../../../shared/classes/socket-controller";
import { SocketClient } from "../../../../shared/services/socket-client.service";

@Component({
  selector: 'app-waiting-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.scss'
})
export class WaitingListComponent extends SocketController {
  constructor(protected readonly injector: Injector) {
    super(
      injector.get(SocketClient),
      injector.get(Router)
    );
  }
}
