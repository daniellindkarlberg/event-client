import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@auth/actions';
import { EventActions } from '@event/actions';
import { Store } from '@ngrx/store';
import { State } from '@root/reducers';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private readonly store: Store<State>, private readonly router: Router) {}

  navigateToEvents() {
    this.router.navigate(['events']);
  }

  navigateToCreateEvent() {
    this.store.dispatch(EventActions.clear());
    this.router.navigate(['events', 'create']);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
