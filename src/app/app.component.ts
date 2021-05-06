import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@auth/actions';
import { EventActions } from '@event/actions';
import { select, Store } from '@ngrx/store';
import { getUser, State } from '@root/reducers';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  user$ = this.store.pipe(select(getUser));

  constructor(private readonly store: Store<State>, private readonly router: Router) {}

  navigateToEvents() {
    this.router.navigate(['events']);
  }

  navigateToCreateEvent() {
    this.store.dispatch(EventActions.clear());
    this.router.navigate(['events', 'create']);
  }

  navigateToUserSettings() {
    this.router.navigate(['user']);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
