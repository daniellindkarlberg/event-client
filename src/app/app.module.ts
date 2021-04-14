import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthModule } from '@auth/auth.module';
import { RequestInterceptor } from '@auth/services';
import { AuthModule as Auth0Module } from '@auth0/auth0-angular';
import { CoreModule } from '@core/core.module';
import { EventModule } from '@event/event.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UserModule } from '@user/user.module';
import { HttpErrorInterceptor } from './services/http-error.interceptor';

import { effects as authEffects } from '@auth/effects';
import { MenuComponent } from '@core/containers';
import { effects as coreEffects } from '@core/effects';
import { services as coreServices } from '@core/services';
import { environment } from '@envs/environment';
import { effects as eventEffects } from '@event/effects';
import { effects as userEffects } from '@user/effects';
import { components } from './components';
import { ROOT_REDUCERS } from './reducers';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

@NgModule({
  declarations: [...components, MenuComponent, AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    MatIconModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([...authEffects, ...coreEffects, ...userEffects, ...eventEffects]),
    Auth0Module.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      audience: environment.auth0.audience,
      redirectUri: `${environment.siteUrl}/auth`,
      scope: 'openid profile email',
    }),
    AuthModule,
    UserModule,
    EventModule,
    CoreModule,
  ],
  exports: [RouterModule],
  providers: [
    ...coreServices,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
