import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'day',
})
export class DayPipe implements PipeTransform {
  transform(timestamp: number): string {
    return `${moment.unix(timestamp).format('D')}`;
  }
}
