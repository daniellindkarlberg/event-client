import { createAction, props } from '@ngrx/store';
import { Notification } from '../models/notification';

export const notificationReceived = createAction(
  '[Notification] Notification Received',
  props<{ notification: Notification }>(),
);
