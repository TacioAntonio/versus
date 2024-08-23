import { CommonModule } from "@angular/common";

import { DialogBoxComponent } from "./components/dialog-box/dialog-box.component";
import { DialogResultBoxComponent } from "./components/dialog-result-box/dialog-result-box.component";
import { GameZoneComponent } from "./components/game-zone/game-zone.component";

export const IMPORTS = [
  CommonModule,
  DialogBoxComponent,
  DialogResultBoxComponent,
  GameZoneComponent
];
