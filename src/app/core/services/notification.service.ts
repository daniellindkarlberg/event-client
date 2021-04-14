import { Injectable } from '@angular/core';
import { Notification, SocketEventType } from '@core/models';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  message$: Observable<Notification>;

  constructor(private socket: SocketService) {
    this.message$ = this.socket.listen(SocketEventType.NOTIFICATION);
  }

  join(room: string) {
    this.socket.join(room);
  }
}
