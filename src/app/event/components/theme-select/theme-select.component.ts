import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Theme } from '@event/models';
import { themes } from '@utils/themes';

@Component({
  selector: 'app-theme-select',
  templateUrl: './theme-select.component.html',
  styleUrls: ['./theme-select.component.scss'],
})
export class ThemeSelectComponent {
  @Input() theme = {} as FormGroup;
  @Output() selectTheme = new EventEmitter<Partial<Theme>>();
  themes = themes;

  get name() {
    return this.theme.get('name').value;
  }

  select(theme: Partial<Theme>) {
    this.selectTheme.emit(theme);
  }
}
