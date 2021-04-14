import { createReducer, on } from '@ngrx/store';
import { User } from '@user/models';

import { UserActions } from '@user/actions';

export interface State extends User {
  loading: boolean;
  events: string[];
}

export const initialState: State = {
  user_id: '',
  username: '',
  nickname: '',
  email: '',
  picture: '',
  loading: false,
  events: [],
};

export const reducer = createReducer(
  initialState,

  on(UserActions.get, (state) => ({
    ...state,
    loading: true,
  })),

  on(UserActions.update, (state) => ({
    ...state,
    loading: true,
  })),

  on(UserActions.getSuccess, (state, { user }) => ({
    ...state,
    ...user,
    loading: false,
  })),

  on(UserActions.getEventsSuccess, (state, { events }) => ({
    ...state,
    events,
    loading: false,
  })),

  on(UserActions.getFailure, UserActions.updateFailure, (state) => ({
    ...state,
    loading: false,
  })),
);
