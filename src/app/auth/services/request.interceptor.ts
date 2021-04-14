import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.getAccessTokenSilently().pipe(
      first(),
      concatMap((token) => {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });

        return next.handle(request);
      }),
    );
  }
}
