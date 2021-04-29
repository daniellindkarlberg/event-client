import { Action, ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromMessenger from '@core/reducers/messenger.reducer';
import * as fromEvent from '@event/reducers/event.reducer';
import * as fromUser from '@user/reducers/user.reducer';

import { InjectionToken } from '@angular/core';

export interface State {
  user: fromUser.State;
  event: fromEvent.State;
  message: fromMessenger.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root reducers token',
  {
    factory: () => ({
      user: fromUser.reducer,
      event: fromEvent.reducer,
      message: fromMessenger.reducer,
    }),
  },
);

// USER STATE
export const getUserState = createFeatureSelector<fromUser.State>('user');
export const getUser = createSelector(getUserState, (state) => state);
export const getUserPicture = createSelector(getUserState, (state) => state.picture);
export const getUserEvents = createSelector(getUserState, (state) => state.events);

// EVENT STATE
export const getEventState = createFeatureSelector<fromEvent.State>('event');
export const getEvents = createSelector(getEventState, fromEvent.selectAll);

export const selectEventEntities = createSelector(getEventState, fromEvent.selectEntities);

export const getSelectedEventId = createSelector(getEventState, (state) => state.selectedId);

export const getEvent = createSelector(
  selectEventEntities,
  getSelectedEventId,
  (eventEntities, eventId) => eventEntities[eventId],
);

export const getLoading = createSelector(getEventState, (state) => state.loading);

// MESSAGE STATE
export const getMessageState = createFeatureSelector<fromMessenger.State>('message');

export const getMessagesLoading = createSelector(getMessageState, (state) => state.loading);

export const getMessages = createSelector(getMessageState, fromMessenger.selectAll);
