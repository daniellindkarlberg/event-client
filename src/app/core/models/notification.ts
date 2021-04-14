import { Event } from '@event/models';

export interface Notification {
  id: string;
  active: boolean;
  event: Partial<Event>;
  types: NotificationType[];
}

export enum NotificationType {
  NAME = 'name',
  LOCATION = 'location',
  DESCRIPTION = 'description',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  MESSAGE = 'message',
  IMAGE = 'image',
}
