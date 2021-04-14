import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { EventLocation } from '@event/models';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';

@Component({
  selector: 'app-places-input',
  templateUrl: './places-input.component.html',
  styleUrls: ['./places-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacesInputComponent {
  @Input() value = '';
  @Input() showSuffix = false;
  @Output() locationChange = new EventEmitter<EventLocation>();
  @Output() openMap = new EventEmitter<void>();

  @ViewChild('placesRef') placesRef = {} as GooglePlaceDirective;

  options = {
    componentRestrictions: { country: 'se' },
    strictBounds: true,
  } as Options;

  change({ formatted_address: address, geometry: { location } }: Address) {
    this.locationChange.emit({
      latitude: location.lat(),
      longitude: location.lng(),
      address,
    });
  }
}
