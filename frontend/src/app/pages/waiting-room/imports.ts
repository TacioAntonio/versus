import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { WaitingListComponent } from "./components/waiting-list/waiting-list.component";
import { GameListComponent } from "./components/game-list/game-list.component";
import { ChatComponent } from "../../shared/components/chat/chat.component";

export const IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  WaitingListComponent,
  ChatComponent,
  GameListComponent
];
