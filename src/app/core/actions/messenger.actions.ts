import { createAction, props } from '@ngrx/store';
import { Message, SocketMessageEvent } from '../models';

export const init = createAction('[Messenger] Init', props<{ messages: Message[] }>());

export const join = createAction('[Messenger] Join', props<{ eventId: string }>());

export const leave = createAction('[Messenger] Leave');

export const send = createAction(
  '[Messenger] Send',
  props<{ event: Partial<SocketMessageEvent> }>(),
);

export const receive = createAction('[Messenger] Receive', props<{ message: Message }>());

export const upload = createAction('[Messenger] Upload', props<{ eventId: string; file: File }>());

export const uploadSuccess = createAction('[Messenger] Upload Success');

export const uploadFailure = createAction('[Messenger] Upload Failure');
