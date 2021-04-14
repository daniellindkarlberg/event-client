import { createAction, props } from '@ngrx/store';
import { User } from '@user/models';

export const get = createAction('[User] Get');
export const getSuccess = createAction('[User] Get Success', props<{ user: User }>());
export const getFailure = createAction('[User] Get Failure');

export const getEvents = createAction('[User] Get Events');
export const getEventsSuccess = createAction(
  '[User] Get Events Success',
  props<{ events: string[] }>(),
);
export const getEventsFailure = createAction('[User] Get Failure');

export const update = createAction('[User] Update', props<{ user: Partial<User> }>());
export const updateSuccess = createAction('[User] Update Success');
export const updateFailure = createAction('[User] Update Failure');
