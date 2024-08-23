import { Routes } from '@angular/router';

import { ColorFirstComponent } from './pages/games/color-first/color-fist.component';
import { WaitingRoomComponent } from './pages/waiting-room/waiting-room.component';
import { WaitingRoomGuard } from './shared/guards/waiting-room.guard';
import { GameRoomGuard } from './shared/guards/game-room.guard';
import { HomeComponent } from './pages/home/home.component';
import { GamesComponent } from './pages/games/games';

export const routes: Routes = [
  {
    path: 'games',
    component: GamesComponent,
    canActivate: [GameRoomGuard],
    children: [
      {
        path: 'color-first',
        component: ColorFirstComponent
      }
    ],
  },
  {
    path: 'waiting-room',
    component: WaitingRoomComponent,
    canActivate: [WaitingRoomGuard]
  },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];


