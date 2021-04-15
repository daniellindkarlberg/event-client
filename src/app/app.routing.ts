import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@auth/services/auth.guard';
import { EventRoutes } from '@event/event.routing';
import { UserRoutes } from '@user/user.routing';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'user', children: UserRoutes, canActivate: [AuthGuard] },
  { path: 'events', children: EventRoutes, canActivate: [AuthGuard] },
  { path: 'not-found', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
