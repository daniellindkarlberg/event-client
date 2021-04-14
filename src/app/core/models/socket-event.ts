export interface SocketMessageEvent {
  eventId: string;
  userId: string;
  text: string;
  photo: boolean;
  imgUrl?: string;
  thumbnailUrl?: string;
}

export enum SocketEventType {
  MESSAGE = 'message',
  NOTIFICATION = 'notification',
  JOIN = 'join',
  LEAVE = 'leave',
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}
