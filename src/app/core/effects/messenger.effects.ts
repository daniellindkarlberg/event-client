import { Injectable } from '@angular/core';
import { MessengerActions } from '@core/actions';
import { MessengerService } from '@core/services/messenger.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { getUser } from '@root/reducers';
import { catchError, concatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class MessengerEffects {
  join$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessengerActions.join),
        tap(({ eventId }) => this.service.join(eventId)),
      ),
    { dispatch: false },
  );

  leave$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessengerActions.leave),
        tap(() => this.service.leave()),
      ),
    { dispatch: false },
  );

  send$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessengerActions.send),
        withLatestFrom(this.store.pipe(select(getUser))),
        tap(([{ event }, user]) => this.service.send({ ...event, userId: user.user_id })),
      ),
    { dispatch: false },
  );

  receive$ = createEffect(() =>
    this.service.message$.pipe(switchMap((message) => [MessengerActions.receive({ message })])),
  );

  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessengerActions.upload),
      withLatestFrom(this.store.pipe(select(getUser))),
      concatMap(([{ eventId, file }, user]) =>
        this.service.upload(file).pipe(
          switchMap(({ imgUrl, thumbnailUrl }) => [
            MessengerActions.uploadSuccess(),
            MessengerActions.send({
              event: {
                eventId,
                userId: user.user_id,
                imgUrl,
                thumbnailUrl,
                photo: true,
              },
            }),
          ]),
          catchError(() => [MessengerActions.uploadFailure()]),
        ),
      ),
    ),
  );

  constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly service: MessengerService,
  ) {}
}
