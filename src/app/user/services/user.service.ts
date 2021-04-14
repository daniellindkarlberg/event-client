import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@user/models';

import { environment } from '@envs/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.eventApiUrl}/user`;

  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<User>(this.apiUrl);
  }

  getEvents() {
    return this.http.get<string[]>(`${this.apiUrl}/event`);
  }

  update(user: Partial<User>) {
    return this.http.patch(this.apiUrl, user);
  }
}
