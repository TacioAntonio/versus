import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Observable } from "rxjs";

import { decodeData, getSession } from "../functions";
import { STATUS } from "../constants";

export const WaitingRoomGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  if (!getSession(STATUS.ON_HOLD)) {
    return inject(Router).createUrlTree(['/home']);
  }

  return decodeData(getSession(STATUS.ON_HOLD)) === STATUS.ON_HOLD ? true : inject(Router).createUrlTree(['/home']);
}
