import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* import { AuthGuard } from '@auth/services/auth.guard'; */
/* canActivate: [AuthGuard]  */
import { EventRoutes } from '@event/event.routing';
import { UserRoutes } from '@user/user.routing';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'user', children: UserRoutes },
  { path: 'events', children: EventRoutes },
  { path: 'not-found', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
