import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '@core/models';
import { createAction, props } from '@ngrx/store';
import { Event } from '../models';

export const get = createAction('[Event] Get');
export const getSuccess = createAction('[Event] Get Success', props<{ events: Event[] }>());
export const getFailure = createAction(
  '[Event] Get Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const getById = createAction(
  '[Event] Get By Id',
  props<{ id: string; shouldInitMessenger: boolean }>(),
);
export const getByIdSuccess = createAction(
  '[Event] Get By Id Success',
  props<{ event: Event; messages: Message[] }>(),
);
export const getByIdFailure = createAction(
  '[Event] Get By Id Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const create = createAction(
  '[Event] Create',
  props<{ event: Event; file: File; invites: string[] }>(),
);
export const createSuccess = createAction('[Event] Create Success');
export const createFailure = createAction(
  '[Event] Create Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const update = createAction(
  '[Event] Update',
  props<{ event: Event; file: File; invites: string[] }>(),
);
export const updateSuccess = createAction('[Event] Update Success', props<{ event: Event }>());
export const updateFailure = createAction(
  '[Event] Update Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const upload = createAction('[Event] Upload', props<{ event: Event; file: File }>());
export const uploadSuccess = createAction('[Event] Upload Success', props<{ event: Event }>());
export const uploadFailure = createAction(
  '[Event] Upload Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const addGuest = createAction('[Event] Add Guest', props<{ id: string }>());
export const addGuestSuccess = createAction('[Event] Add Guest Success');
export const addGuestFailure = createAction(
  '[Event] Add Guest Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const removeGuest = createAction('[Event] Remove Guest', props<{ id: string }>());
export const removeGuestSuccess = createAction('[Event] Reove Guest Success');
export const removeGuestFailure = createAction(
  '[Event] Remnove Guest Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const clear = createAction('[Event] Clear');
