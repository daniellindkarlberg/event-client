import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EventLocation } from '@event/models';
import { style } from './style';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
  @Input() location = {} as EventLocation;
  @Input() zoom = 12;
  @Input() width = 0;
  @Input() height = 0;
  @Input() customSize = false;
  @Input() readonly = false;
  @Input() onlyPlaces = false;

  @Output() locationChange = new EventEmitter<EventLocation>();
  mapTypeStyle: google.maps.MapTypeStyle[] = style;

  constructor() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        this.location.latitude = latitude;
        this.location.longitude = longitude;
      });
    }
  }

  change(location: EventLocation) {
    this.location.latitude = location.latitude;
    this.location.longitude = location.longitude;
    this.zoom = 14;
    this.locationChange.emit(location);
  }
}
