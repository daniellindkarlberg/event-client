import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessengerActions } from '@core/actions';
import { EventActions } from '@event/actions';
import { Event } from '@event/models';
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
  ) {
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

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(EventActions.getById({ id: this.id, shouldInitMessenger: false }));
    this.store.dispatch(UserActions.getEvents());
  }

  ngOnDestroy() {
    this.store.dispatch(MessengerActions.leave());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  get background() {
    return `linear-gradient(180deg, ${this.event.theme.primaryColor} 0%, rgba(255,255,255,1) 100%)`;
  }

  addGuest() {
    this.store.dispatch(EventActions.addGuest({ id: this.id }));
  }

  removeGuest() {
    this.store.dispatch(EventActions.removeGuest({ id: this.id }));
  }

  edit() {
    this.router.navigate(['events', this.id, 'edit']);
  }

  messenger() {
    this.router.navigate(['events', this.id, 'messenger']);
  }
}
