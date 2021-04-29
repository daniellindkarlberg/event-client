import { EventActions } from '@event/actions';
import { removeGuestSuccess } from '@event/actions/event.actions';
import { Event } from '@event/models';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

export interface State extends EntityState<Event> {
  loading: boolean;
  selectedId: string;
}

const adapter: EntityAdapter<Event> = createEntityAdapter<Event>();

export const initialState: State = adapter.getInitialState({
  loading: false,
  selectedId: '',
});

export const reducer = createReducer(
  initialState,

  on(EventActions.get, EventActions.getById, EventActions.create, EventActions.update, (state) => ({
    ...state,
    loading: true,
  })),

  on(EventActions.clear, (state) => ({
    ...state,
    selectedId: '',
  })),

  on(EventActions.getSuccess, (state, { events }) =>
    adapter.upsertMany(events, {
      ...state,
      loading: false,
    }),
  ),

  on(
    EventActions.getByIdSuccess,
    EventActions.uploadSuccess,
    EventActions.updateSuccess,
    (state, { event }) =>
      adapter.upsertOne(event, {
        ...state,
        selectedId: event.id,
        loading: false,
      }),
  ),

  on(EventActions.addGuestSuccess, removeGuestSuccess, (state, { event }) =>
    adapter.updateOne(event, state),
  ),

  on(
    EventActions.getFailure,
    EventActions.getByIdFailure,
    EventActions.createFailure,
    EventActions.updateFailure,
    EventActions.uploadFailure,
    (state) => ({
      ...state,
      loading: false,
    }),
  ),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
