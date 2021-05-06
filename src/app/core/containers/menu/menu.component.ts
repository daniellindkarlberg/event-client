import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@user/models';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @Input() set user(user: User) {
    this.picture = `${user.picture}?${new Date()}`;
  }
  @Output() navigateToEvents = new EventEmitter<void>();
  @Output() navigateToCreateEvent = new EventEmitter<void>();
  @Output() navigateToUserSettings = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  mobile = false;
  picture = '';

  constructor(private deviceService: DeviceDetectorService) {
    this.mobile = this.deviceService.isMobile();
  }
}
