import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login Request', props<{ url: string }>());
export const loginSuccess = createAction('[Auth] Login Success');
export const loginFailure = createAction('[Auth] Login Failure');

export const logout = createAction('[Auth] Logout');
