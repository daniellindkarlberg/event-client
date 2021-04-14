import {
  EditComponent,
  EventComponent,
  EventsComponent,
  MessengerComponent,
} from '@event/containers';

export { EventComponent } from '@event/containers/event/event.component';
export { EventsComponent } from '@event/containers/events/events.component';
export { EditComponent } from '@event/containers/edit/edit.component';
export { MessengerComponent } from '@event/containers/messenger/messenger.component';

export const containers = [EventComponent, EventsComponent, EditComponent, MessengerComponent];
