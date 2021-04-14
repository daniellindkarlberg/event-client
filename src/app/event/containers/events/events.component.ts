import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventActions } from '@event/actions';
import { select, Store } from '@ngrx/store';
import { getEvents, getLoading, State } from '@root/reducers';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  events$ = this.store.pipe(select(getEvents));
  loading$ = this.store.pipe(select(getLoading));

  constructor(private readonly store: Store<State>, private readonly router: Router) {
    this.store.dispatch(EventActions.get());
  }

  navigateToEvent(id: string) {
    this.router.navigate(['events', id]);
  }
}
