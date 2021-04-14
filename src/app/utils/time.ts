import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';

export interface Hour {
  hour: string;
}

export const getSelectOptions = () => {
  const hours = Array(24)
    .fill(false)
    .reduce(
      (acc: Moment[], _, index) => [
        ...acc,
        {
          hour: index,
        },
        {
          hour: index,
          minute: 15,
        },
        {
          hour: index,
          minute: 30,
        },
        {
          hour: index,
          minute: 45,
        },
      ],
      [],
    )
    .map((object: Moment) => ({ hour: moment(object).format('h:mm A') }));

  return hours;
};

export const getFilteredSelectOptions = () => {
  const currentHour = getRoundedHour();
  const options = [...getSelectOptions()];

  return options.filter(
    (option) =>
      moment(option.hour, 'h:mm A').isSame(moment(currentHour, 'h:mm A')) ||
      moment(option.hour, 'h:mm A').isAfter(moment(currentHour, 'h:mm A')),
  );
};

export const getRoundedHour = () => {
  const currentTime = moment(Date.now());
  const duration = moment.duration(15, 'minutes');

  return moment(Math.ceil(+currentTime / +duration) * +duration).format('LT');
};

export const getTimeWithAddedHour = (hour: string) => {
  return moment(hour, 'h:mm A').add(1, 'hours').format('LT');
};

export const getTimestamp = (iso: string, time: string) => {
  const twentyFourHourTimeFormat = moment(time, 'h:mm A').format('HH:mm');
  const formattedDate = moment(iso)
    .format()
    .replace(
      /^(\d{4}-\d{2}-\d{2}T)\d{2}:\d{2}(\:\d{2}\+\d{2}:\d{2})$/,
      `$1${twentyFourHourTimeFormat}$2`,
    );
  const utc = new Date(formattedDate);
  return moment(utc).unix();
};

export const dateValidation = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('startDate');
  const endDate = control.get('endDate');

  if (
    startDate &&
    endDate &&
    moment(endDate.value).startOf('day').isBefore(moment(startDate.value).startOf('day'))
  ) {
    return { invalidDate: true };
  }

  return null;
};

export const timeValidation = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('startDate');
  const endDate = control.get('endDate');
  const startTime = control.get('startTime');
  const endTime = control.get('endTime');

  if (
    startTime &&
    endTime &&
    moment(startDate.value).isSame(moment(endDate.value)) &&
    moment(endTime.value, 'h:mm A').isBefore(moment(startTime.value, 'h:mm A'))
  ) {
    return { invalidTime: true };
  }

  return null;
};
