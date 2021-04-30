import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  upload(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
