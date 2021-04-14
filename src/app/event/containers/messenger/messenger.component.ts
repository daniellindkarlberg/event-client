import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessengerActions } from '@core/actions';
import { Message } from '@core/models';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Mode, Theme } from '@event/models';
import { select, Store } from '@ngrx/store';
import { getMessages, getMessagesLoading, getUser, State } from '@root/reducers';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
  animations: [
    trigger('arrow', [
      transition(':enter', [style({ height: 0 }), animate(150)]),
      transition(':leave', [animate(150, style({ height: 0 }))]),
    ]),
  ],
})
export class MessengerComponent implements AfterViewInit, OnDestroy {
  Mode = Mode;

  @Output() send = new EventEmitter<string>();

  @ViewChild('content') content = {} as ElementRef;
  @ViewChild('messageContainer') messageContainer = {} as ElementRef;

  loading$ = this.store.pipe(select(getMessagesLoading));
  notification$ = new BehaviorSubject<boolean>(false);
  destroy$: Subject<boolean> = new Subject<boolean>();

  userId = '';
  eventId = '';
  messages: Message[] = [];
  messageForm = new FormControl('', Validators.required);
  currentUser = false;
  theme = {} as Theme;
  showEmoticons = false;
  showFullSizeImage = false;
  inView = true;
  imgSrc = '';
  fullSizeImageUrl = '';

  constructor(
    private dialogRef: MatDialogRef<MessengerComponent>,
    private readonly store: Store<State>,
    @Inject(MAT_DIALOG_DATA) { eventId, theme },
  ) {
    this.theme = theme;
    this.eventId = eventId;
    this.store
      .pipe(select(getUser), takeUntil(this.destroy$))
      .subscribe((user) => (this.userId = user.user_id));
    this.store
      .pipe(
        select(getMessages),
        filter((messages) => messages.length > 0),
        takeUntil(this.destroy$),
      )
      .subscribe((messages) => {
        const { sender } = messages[messages.length - 1];
        this.currentUser = sender.user_id === this.userId;
        this.messages = messages;

        if (this.currentUser || this.inView) {
          this.scrollIntoView();
        } else {
          this.notification$.next(true);
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
    fromEvent(this.content.nativeElement, 'scroll')
      .pipe(
        tap(({ target: { scrollTop, scrollHeight } }) => {
          this.inView = scrollHeight - scrollTop < 1000;
          if (this.inView) {
            this.notification$.next(false);
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  get messageFormValid() {
    const value = this.messageForm.value?.replace(/^\n|\n$/g, '').trim();
    return value && this.messageForm.valid;
  }

  get darkMode() {
    return this.theme.darkMode;
  }

  sendMessage() {
    this.send.emit(this.messageForm.value);
    this.messageForm.reset();
  }

  select(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgSrc = reader.result as string;
        this.store.dispatch(MessengerActions.upload({ eventId: this.eventId, file }));
      };
    }
    this.scrollIntoView();
  }

  keypress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.messageForm.valid) {
        this.sendMessage();
      }
    }
  }

  addEmoji({ emoji }: EmojiEvent) {
    this.messageForm.patchValue(`${this.messageForm.value || ''}${emoji.native}`);
  }

  scrollIntoView() {
    setTimeout(() => {
      this.messageContainer?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 100);
  }

  scrollToBottom() {
    this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
  }

  close() {
    this.dialogRef.close();
  }
}
