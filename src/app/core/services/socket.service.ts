import { Injectable } from '@angular/core';
import { Message, Notification, SocketEventType, SocketMessageEvent } from '@core/models';
import { environment } from '@envs/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  connected$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket = io(environment.socketBaseUrl);
    this.socket.on(SocketEventType.CONNECT, () => this.connected$.next(true));
    this.socket.on(SocketEventType.DISCONNECT, () => this.connected$.next(false));
  }

  join(eventId: string) {
    this.socket.connect();
    this.connected$
      .pipe(filter((connected) => !!connected))
      .subscribe(() => this.socket.emit(SocketEventType.JOIN, eventId));
  }

  leave() {
    this.socket.disconnect();
  }

  emit(type: SocketEventType, event: Partial<SocketMessageEvent>) {
    this.socket.emit(type, event);
  }

  listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data: Message | Notification) => observer.next(data));
      return () => this.socket.off(event);
    });
  }
}
