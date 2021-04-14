import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MessengerActions } from '@core/actions';
import { EventActions } from '@event/actions';
import { MessengerComponent } from '@event/containers/messenger/messenger.component';
import { Event, Mode } from '@event/models';
import { select, Store } from '@ngrx/store';
import { getLoading, getUser, getUserEvents, selectCurrentEvent, State } from '@root/reducers';
import { UserActions } from '@user/actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  loading$ = this.store.pipe(select(getLoading));
  destroy$: Subject<boolean> = new Subject<boolean>();

  id = '';
  event = {} as Event;
  currentUserId = '';
  currentUserAttending = false;

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(EventActions.getById({ id: this.id }));
    this.store.dispatch(UserActions.getEvents());
    this.store.dispatch(MessengerActions.join({ eventId: this.id }));

    this.store
      .pipe(select(selectCurrentEvent), takeUntil(this.destroy$))
      .subscribe((event) => (this.event = event));
    this.store
      .pipe(select(getUser), takeUntil(this.destroy$))
      .subscribe((user) => (this.currentUserId = user.user_id));
    this.store
      .pipe(select(getUserEvents), takeUntil(this.destroy$))
      .subscribe((events) => (this.currentUserAttending = events.includes(this.id)));
  }

  ngOnDestroy() {
    this.store.dispatch(MessengerActions.leave());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  get background() {
    return `linear-gradient(180deg, ${this.event.theme.primaryColor} 0%, rgba(255,255,255,1) 100%)`;
  }

  edit() {
    this.router.navigate(['events', this.id, 'edit']);
  }

  openMessenger() {
    const dialogRef = this.dialog.open(MessengerComponent, {
      disableClose: true,
      data: { eventId: this.id, theme: this.event.theme },
      panelClass: `app-messenger-${this.event.theme.darkMode ? Mode.DARK : Mode.LIGHT}`,
    });

    const subscription = dialogRef.componentInstance.send.subscribe((message) =>
      this.store.dispatch(
        MessengerActions.send({
          event: { eventId: this.id, text: message },
        }),
      ),
    );

    dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }
}
