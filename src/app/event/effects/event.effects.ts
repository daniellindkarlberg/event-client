import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessengerActions } from '@core/actions';
import { EventActions } from '@event/actions';
import { EventService } from '@event/services/event.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class EventEffects {
  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.get),
      concatMap(() =>
        this.service.get().pipe(
          map((events) => EventActions.getSuccess({ events })),
          catchError((error) => [EventActions.getFailure({ error })]),
        ),
      ),
    ),
  );

  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.getById),
      concatMap(({ id }) =>
        this.service.getById(id).pipe(
          switchMap(({ event, messages }) => [
            EventActions.getByIdSuccess({ event, messages }),
            MessengerActions.init({ messages }),
          ]),
          catchError((error) => [EventActions.getByIdFailure({ error })]),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.create),
      concatMap(({ event, file, invites }) =>
        this.service.create(event, invites).pipe(
          switchMap((payload) => [
            EventActions.upload({ event: payload, file }),
            EventActions.createSuccess(),
          ]),
          catchError((error) => [EventActions.createFailure({ error })]),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.update),
      concatMap(({ event, file, invites }) =>
        this.service.update(event, invites).pipe(
          switchMap((payload) => {
            if (!!file.type) {
              return [EventActions.upload({ event: payload, file })];
            } else {
              return [EventActions.updateSuccess({ event: payload })];
            }
          }),
          catchError((error) => [EventActions.updateFailure({ error })]),
        ),
      ),
    ),
  );

  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventActions.upload),
      concatMap(({ event, file }) =>
        this.service.upload(file, event.id).pipe(
          map(({ imgUrl }) =>
            EventActions.uploadSuccess({
              event: { ...event, photo: { ...event.photo, imgUrl } },
            }),
          ),
          catchError((error) => [EventActions.uploadFailure({ error })]),
        ),
      ),
    ),
  );

  navigateToEvent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EventActions.uploadSuccess, EventActions.updateSuccess),
        tap(({ event }) => this.router.navigate(['events', event.id])),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly service: EventService,
    private readonly router: Router,
  ) {}
}
