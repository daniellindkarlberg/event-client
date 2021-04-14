import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from '@core/models';
import { Mode } from '@event/models';
import * as moment from 'moment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  Mode = Mode;
  @Input() message = {} as Message;
  @Input() theme = '';
  @Input() darkMode = false;
  @Input() userId = '';
  @Output() fullSize = new EventEmitter<string>();

  get time() {
    return moment.unix(this.message.createdAt).format('lll');
  }

  get currentUser() {
    return this.message.sender.user_id === this.userId;
  }
}
