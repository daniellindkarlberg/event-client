import { Routes } from '@angular/router';

import {
  EditComponent,
  EventComponent,
  EventsComponent,
  MessengerComponent,
} from '@event/containers';

export const EventRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EventsComponent,
  },
  {
    path: 'create',
    component: EditComponent,
  },
  {
    path: ':id',
    component: EventComponent,
  },
  {
    path: ':id/edit',
    pathMatch: 'full',
    component: EditComponent,
  },
  {
    path: ':id/messenger',
    pathMatch: 'full',
    component: MessengerComponent,
  },
];
