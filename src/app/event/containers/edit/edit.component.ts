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
import { Category, Event, EventLocation, Host, Image, Privacy, Theme } from '@event/models';
import { select, Store } from '@ngrx/store';
import { getEvent, getLoading, getUser, State } from '@root/reducers';
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
import { DeviceDetectorService } from 'ngx-device-detector';
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
  Privacy = Privacy;

  private readonly destroy$ = new Subject();
  loading$ = this.store.pipe(select(getLoading));

  eventId = '';
  host = {} as Host;
  imageSrc = '';
  photoPositionTop = 0;
  minDate = new Date();
  locationSelected = false;
  showEndDate = false;
  mobile = false;

  categories: Category[] = [
    { name: 'Art', value: 'art', icon: 'palette' },
    { name: 'Causes', value: 'causes', icon: 'bookmark' },
    { name: 'Comedy', value: 'comedy', icon: 'sentiment_very_satisfied' },
    { name: 'Crafs', value: 'crafts', icon: 'content_cut' },
    { name: 'Drinks', value: 'drinks', icon: 'nightlife' },
    { name: 'Film', value: 'film', icon: 'videocam' },
    { name: 'Fitness', value: 'fitness', icon: 'fitness_center' },
    { name: 'Food', value: 'food', icon: 'restaurant' },
    { name: 'Games', value: 'games', icon: 'games' },
    { name: 'Gardening', value: 'gardening', icon: 'local_florist' },
    { name: 'Health', value: 'health', icon: 'health_and_safety' },
    { name: 'Home', value: 'home', icon: 'home' },
    { name: 'Literature', value: 'literature', icon: 'menu_book' },
    { name: 'Music', value: 'music', icon: 'audiotrack' },
    { name: 'Networking', value: 'networking', icon: 'share' },
    { name: 'Party', value: 'party', icon: 'cake' },
    { name: 'Shopping', value: 'shopping', icon: 'shopping_bag' },
    { name: 'Sports', value: 'sports', icon: 'sports_soccer' },
    { name: 'Theatre', value: 'theatre', icon: 'theater_comedy' },
    { name: 'Wellness', value: 'wellness', icon: 'spa' },
  ];
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
      privacy: new FormControl(Privacy.PUBLIC),
      category: new FormControl('value'),
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
    private deviceService: DeviceDetectorService,
  ) {
    this.mobile = this.deviceService.isMobile();
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.store
      .pipe(select(getEvent))
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
      this.store.dispatch(EventActions.getById({ id: this.eventId, shouldInitMessenger: false }));
      options = getSelectOptions();
    } else {
      options = getFilteredSelectOptions();
    }

    this.hours[Time.START] = options;
    this.hours[Time.END] = options;
  }

  ngOnDestroy() {
    this.destroy$.next();
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

  get category() {
    return this.detailsForm.get('category').value;
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

  themeChange(theme: Partial<Theme>) {
    this.themeForm.patchValue(theme);
  }

  addEmail() {
    this.emails.push(new FormControl('', [Validators.email, Validators.required]));
  }

  removeEmail(index: number) {
    this.emails.removeAt(index);
  }

  save() {
    const { name, startDate, startTime, endDate, endTime, location, description, theme } = this;
    const { file } = this.photoForm.value;
    const { privacy } = this.detailsForm.value;
    const category = this.categories.find((c) => c.value === this.category) || ({} as Category);
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
      privacy,
      category,
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
      data: {
        location: this.location,
        width: this.mobile ? 250 : 500,
        height: this.mobile ? 250 : 500,
      },
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
    const {
      host,
      name,
      startDate,
      endDate,
      description,
      photo,
      location,
      theme,
      privacy,
      category: { value },
    } = event;

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
      privacy,
      category: value,
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
