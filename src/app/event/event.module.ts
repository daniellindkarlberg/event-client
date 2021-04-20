import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import player from 'lottie-web';
import { ClickOutsideModule } from 'ng-click-outside';
import { AutosizeModule } from 'ngx-autosize';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { LottieModule } from 'ngx-lottie';

import { environment } from '@envs/environment';
import { DateAndTimePipe } from '@utils/date-and-time.pipe';
import { DayPipe } from '@utils/day.pipe';
import { LinkPipe } from '@utils/link.pipe';
import { components, MapDialogComponent } from './components';
import { containers } from './containers';
import { services } from './services';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [...containers, ...components, DateAndTimePipe, DayPipe, LinkPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    GooglePlaceModule,
    PickerModule,
    ClickOutsideModule,
    AutosizeModule,
    LottieModule.forRoot({ player: playerFactory }),
    AgmCoreModule.forRoot({
      apiKey: environment.google.apiKey,
    }),
  ],
  providers: [...services],
  entryComponents: [MapDialogComponent],
})
export class EventModule {}
