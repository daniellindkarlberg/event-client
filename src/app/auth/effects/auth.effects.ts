import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Actions, createEffect, ofType /* ROOT_EFFECTS_INIT */ } from '@ngrx/effects';
import { /* catchError,  */ /* filter, */ /*  map, switchMap,  */ tap } from 'rxjs/operators';

import { AuthActions } from '@auth/actions';
// import { environment } from '@envs/environment';
// import { UserActions } from '@user/actions';

@Injectable()
export class AuthEffects {
  /*  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ url }) =>
        this.service
          .loginWithRedirect({
            redirect_uri: `${environment.siteUrl}/auth`,
            appState: { target: url },
          })
          .pipe(
            map(() => AuthActions.loginSuccess()),
            catchError(() => [AuthActions.loginFailure()]),
          ),
      ),
    ),
  ); */

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout, AuthActions.loginFailure),
        tap(() => this.service.logout()),
      ),
    { dispatch: false },
  );

  /*   init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() =>
        this.service.isAuthenticated$.pipe(
          filter((authenticated) => authenticated),
          switchMap(() => [UserActions.get()]),
        ),
      ),
    ),
  ); */

  constructor(private readonly actions$: Actions, private readonly service: AuthService) {}
}
