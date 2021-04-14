import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@core/models';
import { environment } from '@envs/environment';
import { Event } from '@event/models';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.eventApiUrl}/events`;

  constructor(private readonly http: HttpClient) {}

  get() {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<{ event: Event; messages: Message[] }>(`${this.apiUrl}/${id}`);
  }

  create(event: Event, invites: string[]) {
    return this.http.post<Event>(this.apiUrl, { event, invites });
  }

  update(event: Event, invites: string[]) {
    return this.http.put<Event>(`${this.apiUrl}/${event.id}`, {
      event,
      invites,
    });
  }

  upload(file: File, id: string) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ imgUrl: string }>(`${this.apiUrl}/upload/${id}`, formData);
  }
}
