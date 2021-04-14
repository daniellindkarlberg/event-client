import { MessengerActions } from '@core/actions';
import { Message } from '@core/models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

export interface State extends EntityState<Message> {
  loading: boolean;
}

const adapter: EntityAdapter<Message> = createEntityAdapter<Message>();

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export const reducer = createReducer(
  initialState,

  on(MessengerActions.init, (state, { messages }) => adapter.setAll(messages, state)),

  on(MessengerActions.receive, (state, { message }) => adapter.upsertOne(message, state)),

  on(MessengerActions.upload, (state) => ({
    ...state,
    loading: true,
  })),

  on(MessengerActions.uploadSuccess, MessengerActions.uploadFailure, (state) => ({
    ...state,
    loading: false,
  })),
);
export const { selectAll, selectTotal, selectIds } = adapter.getSelectors();
