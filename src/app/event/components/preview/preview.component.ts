import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EventLocation, Host } from '@event/models';
import * as moment from 'moment';

enum Platform {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  Platform = Platform;

  @Input() host = {} as Host;
  @Input() name = '';
  @Input() startDate = '';
  @Input() startTime = '';
  @Input() endDate = '';
  @Input() endTime = '';
  @Input() location = {} as EventLocation;
  @Input() description = '';
  @Input() imageSrc = '';
  @Input() photoPositionTop = 0;
  @Input() color = '';
  @Input() locationSelected = false;

  platform = Platform.DESKTOP;

  get day() {
    return moment(this.startDate).format('D');
  }

  get formattedStartDate() {
    return moment(this.startDate).format('dddd, MMMM Do YYYY');
  }

  get formattedEndDate() {
    return moment(this.endDate).format('dddd, MMMM Do YYYY');
  }

  get background() {
    return `linear-gradient(180deg, ${this.color} 0%, rgba(255,255,255,1) 100%)`;
  }
}
