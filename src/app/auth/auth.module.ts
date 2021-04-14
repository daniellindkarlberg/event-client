import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth.routing';
import { components } from './components';

@NgModule({
  declarations: [...components],
  imports: [CommonModule, AuthRoutingModule],
})
export class AuthModule {}
