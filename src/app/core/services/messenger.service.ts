import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message, SocketEventType, SocketMessageEvent } from '@core/models';
import { SocketService } from '@core/services/socket.service';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessengerService {
  private apiUrl = `${environment.eventApiUrl}`;
  message$: Observable<Message>;

  constructor(private readonly http: HttpClient, private socket: SocketService) {
    this.message$ = this.socket.listen(SocketEventType.MESSAGE);
  }

  join(eventId: string) {
    this.socket.join(eventId);
  }

  leave() {
    this.socket.leave();
  }

  send(event: Partial<SocketMessageEvent>) {
    this.socket.emit(SocketEventType.MESSAGE, event);
  }

  upload(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ imgUrl: string; thumbnailUrl: string }>(
      `${this.apiUrl}/upload`,
      formData,
    );
  }
}
