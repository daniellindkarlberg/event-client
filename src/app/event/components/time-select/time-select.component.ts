import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Hour } from '@utils/time';

@Component({
  selector: 'app-time-select',
  templateUrl: './time-select.component.html',
  styleUrls: ['./time-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeSelectComponent),
      multi: true,
    },
  ],
})
export class TimeSelectComponent implements ControlValueAccessor {
  @Input() options = [] as Hour[];
  @Input() label = '';
  @Input() error = false;
  selected = '';

  onTouched = () => {};
  onChange = (value: string) => {};

  writeValue(value: string) {
    this.selected = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  change(event: any) {
    this.onChange(event.value);
  }
}
