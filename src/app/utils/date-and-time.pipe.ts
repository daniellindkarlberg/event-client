import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateAndTime',
})
export class DateAndTimePipe implements PipeTransform {
  transform(timestamp: number): string {
    return `${moment.unix(timestamp).format('dddd, MMMM Do')} AT ${moment
      .unix(timestamp)
      .format('LT')}`;
  }
}
