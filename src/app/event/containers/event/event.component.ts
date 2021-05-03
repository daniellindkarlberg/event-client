import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessengerActions } from '@core/actions';
import { EventActions } from '@event/actions';
import { Event, Privacy } from '@event/models';
import { select, Store } from '@ngrx/store';
import { getEvent, getLoading, getUser, getUserEvents, State } from '@root/reducers';
import { UserActions } from '@user/actions';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  Privacy = Privacy;

  private readonly destroy$ = new Subject();
  loading$ = this.store.pipe(select(getLoading));

  id = '';
  event = {} as Event;
  userId = '';
  currentUserAttending = false;
  showMessenger = false;
  mobile = false;

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private deviceService: DeviceDetectorService,
  ) {
    this.mobile = this.deviceService.isMobile();
    this.store
      .pipe(select(getEvent), takeUntil(this.destroy$))
      .subscribe((event) => (this.event = event));
    this.store
      .pipe(select(getUser), takeUntil(this.destroy$))
      .subscribe((user) => (this.userId = user.user_id));
    this.store
      .pipe(select(getUserEvents), takeUntil(this.destroy$))
      .subscribe((userEvents) => (this.currentUserAttending = userEvents.includes(this.id)));
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(EventActions.getById({ id: this.id, shouldInitMessenger: true }));
    this.store.dispatch(UserActions.getEvents());
  }

  ngOnDestroy() {
    this.store.dispatch(MessengerActions.leave());
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  get headerBackground() {
    return this.mobile
      ? `linear-gradient(170deg,  ${this.event.theme.primaryColor} 0%, rgba(255, 255, 255, 0) 17%)`
      : '#ffffff';
  }

  get photoBackground() {
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
}
