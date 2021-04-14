import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { containers } from './containers';

import { UserComponent } from './containers/user/user.component';

@NgModule({
  declarations: [...containers, UserComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserModule {}
