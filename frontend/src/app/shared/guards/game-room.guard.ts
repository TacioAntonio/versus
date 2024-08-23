import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Observable } from "rxjs";

import { decodeData, getSession } from "../functions";
import { STATUS } from "../constants";

export const GameRoomGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  if (!getSession(STATUS.GAME_ROOM)) {
    return inject(Router).createUrlTree(['/home']);
  }

  return decodeData(getSession(STATUS.GAME_ROOM)) === STATUS.GAME_ROOM ? true : inject(Router).createUrlTree(['/home']);
}
