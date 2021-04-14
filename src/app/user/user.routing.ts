import { Routes } from '@angular/router';

import { UserComponent } from './containers';

export const UserRoutes: Routes = [
  { path: '', pathMatch: 'full', component: UserComponent },
];
