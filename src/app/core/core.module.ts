import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { services } from './services';

@NgModule({
  imports: [CommonModule],
  providers: [...services],
})
export class CoreModule {}
