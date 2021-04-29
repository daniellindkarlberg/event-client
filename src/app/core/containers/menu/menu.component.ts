import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() userPicture = '';
  @Output() navigateToEvents = new EventEmitter<void>();
  @Output() navigateToCreateEvent = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
