import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from '@user/actions';
import { UserService } from '@user/services';
import { catchError, concatMap, map } from 'rxjs/operators';

@Injectable()
export class UserEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.get),
      concatMap(() =>
        this.service.get().pipe(
          map((user) => UserActions.getSuccess({ user })),
          catchError(() => [UserActions.getFailure()]),
        ),
      ),
    ),
  );

  getEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getEvents),
      concatMap(() =>
        this.service.getEvents().pipe(
          map((events) => UserActions.getEventsSuccess({ events })),
          catchError(() => [UserActions.getEventsFailure()]),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.update),
      concatMap(({ user }) =>
        this.service.update(user).pipe(
          map(() => UserActions.updateSuccess()),
          catchError(() => [UserActions.updateFailure()]),
        ),
      ),
    ),
  );

  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.upload),
      concatMap(({ file }) =>
        this.service.upload(file).pipe(
          map(({ url }) => UserActions.uploadSuccess({ url })),
          catchError((error) => [UserActions.uploadFailure({ error })]),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly service: UserService) {}
}
