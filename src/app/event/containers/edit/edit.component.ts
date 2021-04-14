import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EventActions } from '@event/actions';
import { MapDialogComponent } from '@event/components';
import { Event, EventLocation, Host, Image, Theme } from '@event/models';
import { select, Store } from '@ngrx/store';
import { getLoading, getUser, selectCurrentEvent, State } from '@root/reducers';
import {
  dateValidation,
  getFilteredSelectOptions,
  getRoundedHour,
  getSelectOptions,
  getTimestamp,
  getTimeWithAddedHour,
  Hour,
  timeValidation,
} from '@utils/time';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

enum Time {
  START = 'startTime',
  END = 'endTime',
}

export const CUSTOM_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS },
  ],
})
export class EditComponent implements OnInit, OnDestroy {
  Time = Time;

  event$ = this.store.pipe(select(selectCurrentEvent));
  loading$ = this.store.pipe(select(getLoading));
  destroy$: Subject<boolean> = new Subject<boolean>();

  eventId = '';
  host = {} as Host;
  imageSrc = '';
  photoPositionTop = 0;
  minDate = new Date();
  locationSelected = false;
  showEndDate = false;
  showInvites = false;
  showMap = false;

  hours = {
    [Time.START]: [] as Hour[],
    [Time.END]: [] as Hour[],
  };

  detailsForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      startDate: new FormControl(moment(Date.now()), Validators.required),
      startTime: new FormControl(getRoundedHour(), Validators.required),
      endDate: new FormControl(null),
      endTime: new FormControl(null),
    },
    Validators.compose([dateValidation, timeValidation]),
  );
  locationForm = new FormGroup({
    latitude: new FormControl(59.33258),
    longitude: new FormControl(18.0649),
    address: new FormControl(''),
  });
  descriptionForm = new FormGroup({
    description: new FormControl('', Validators.required),
  });
  photoForm = new FormGroup({
    file: new FormControl('', Validators.required),
  });
  themeForm = new FormGroup({
    name: new FormControl(''),
    primaryColor: new FormControl(''),
    darkMode: new FormControl(false),
  });
  inviteForm = new FormGroup({
    emails: new FormArray([]),
  });

  constructor(
    private readonly store: Store<State>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.event$
      .pipe(
        filter((event) => !!event),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => this.setInitialValues(event));
    this.store.pipe(select(getUser), takeUntil(this.destroy$)).subscribe(
      ({ user_id, nickname, picture }) =>
        (this.host = {
          id: user_id,
          nickname,
          picture,
        }),
    );
  }

  ngOnInit() {
    let options = [];

    if (this.eventId) {
      this.store.dispatch(EventActions.getById({ id: this.eventId }));
      options = getSelectOptions();
    } else {
      options = getFilteredSelectOptions();
    }

    this.hours[Time.START] = options;
    this.hours[Time.END] = options;
  }

  ngOnDestroy() {
    this.store.dispatch(EventActions.clear());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  get name() {
    return this.detailsForm.get('name').value;
  }

  get startDate() {
    return this.detailsForm.get('startDate').value;
  }

  get startTime() {
    return this.detailsForm.get('startTime').value;
  }

  get endDate() {
    return this.detailsForm.get('endDate').value;
  }

  get endTime() {
    return this.detailsForm.get('endTime').value;
  }

  get location() {
    return this.locationForm.value;
  }

  get address() {
    return this.locationForm.get('address').value;
  }

  get description() {
    return this.descriptionForm.get('description').value;
  }

  get emails(): FormArray {
    return this.inviteForm.get('emails') as FormArray;
  }

  get theme() {
    return this.themeForm.value;
  }

  get invalidDate() {
    return this.detailsForm.hasError('invalidDate');
  }

  get invalidTime() {
    return this.detailsForm.hasError('invalidTime');
  }

  fileChange({ file, imageSrc }: Image) {
    this.photoForm.patchValue({ file });
    this.imageSrc = imageSrc;
  }

  fileReset() {
    this.photoForm.reset();
    this.imageSrc = '';
  }

  dateChange(date: Moment, time: Time) {
    const today = moment(date).isSame(moment(), 'day');
    const items = today ? getFilteredSelectOptions() : getSelectOptions();
    this.hours[time] = items;
  }

  locationChange(location: EventLocation) {
    this.locationForm.patchValue(location);
    this.locationSelected = true;
  }

  addEmailField() {
    this.emails.push(new FormControl('', [Validators.email, Validators.required]));
  }

  removeEmailField(index: number) {
    this.emails.removeAt(index);
  }

  selectTheme(theme: Partial<Theme>) {
    this.themeForm.patchValue(theme);
  }

  save() {
    const { name, startDate, startTime, endDate, endTime, location, description, theme } = this;
    const { file } = this.photoForm.value;
    const event = {
      name,
      startDate: getTimestamp(startDate, startTime),
      ...(endDate && { endDate: getTimestamp(endDate, endTime) }),
      location,
      description,
      photo: {
        positionTop: this.photoPositionTop,
      },
      theme,
    } as Event;

    if (this.eventId) {
      this.store.dispatch(
        EventActions.update({
          event: { ...event, id: this.eventId },
          file,
          invites: this.emails.value,
        }),
      );
    } else {
      this.store.dispatch(EventActions.create({ event, file, invites: this.emails.value }));
    }
  }

  openMapDialog() {
    const dialogRef = this.dialog.open(MapDialogComponent, {
      disableClose: true,
      data: this.location,
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((location: EventLocation) => this.locationChange(location));
  }

  toggleEndDate() {
    if (!this.showEndDate) {
      this.detailsForm.patchValue({
        endDate: this.startDate,
        endTime: getTimeWithAddedHour(this.startTime),
      });
    } else {
      this.detailsForm.patchValue({ endDate: null, endTime: null });
    }

    this.showEndDate = !this.showEndDate;
  }

  setInitialValues(event: Event) {
    const { host, name, startDate, endDate, description, photo, location, theme } = event;

    if (endDate) {
      this.showEndDate = true;
    }

    this.host = host;
    this.detailsForm.patchValue({
      name,
      startDate: moment.unix(startDate),
      startTime: moment.unix(startDate).format('LT'),
      ...(endDate && {
        endDate: moment.unix(endDate),
        endTime: moment.unix(endDate).format('LT'),
      }),
    });
    this.descriptionForm.patchValue({ description });
    this.imageSrc = photo.imgUrl;
    this.photoPositionTop = photo.positionTop;
    this.photoForm.patchValue({ file: {} });
    this.locationForm.patchValue(location);
    this.locationSelected = true;
    this.themeForm.patchValue(theme);
  }
}
