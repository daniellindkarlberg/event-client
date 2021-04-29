import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessengerActions } from '@core/actions';
import { Message } from '@core/models';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Event, Mode } from '@event/models';
import { select, Store } from '@ngrx/store';
import { getMessages, getMessagesLoading, State } from '@root/reducers';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import scrollIntoView from 'scroll-into-view-if-needed';

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
export class MessengerComponent implements OnInit, AfterViewInit, OnDestroy {
  Mode = Mode;

  @ViewChild('content') content = {} as ElementRef;
  @ViewChild('messageContainer') messageContainer = {} as ElementRef;

  private readonly destroy$ = new Subject();
  loading$ = this.store.pipe(select(getMessagesLoading));

  @Input() userId = '';
  @Input() event = {} as Event;
  @Output() closeMessenger = new EventEmitter<void>();

  messages: Message[] = [];
  messageForm = new FormControl('', Validators.required);
  currentUser = false;
  showEmoticons = false;
  showFullSizeImage = false;
  showNewMessageNotification = false;
  inView = true;
  activeReply = false;
  replyToMessage = {} as Message;
  imgSrc = '';
  fullSizeImageUrl = '';

  constructor(private readonly store: Store<State>) {}

  ngOnInit() {
    this.store.dispatch(MessengerActions.join({ eventId: this.event.id }));
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
          setTimeout(() => this.scrollToBottom(), 0);
        } else {
          this.showNewMessageNotification = true;
        }
      });
  }

  ngAfterViewInit() {
    fromEvent(this.content.nativeElement, 'scroll')
      .pipe(
        tap(({ target: { scrollTop, scrollHeight } }) => {
          this.inView = scrollHeight - scrollTop < 1000;
          if (this.inView) {
            this.showNewMessageNotification = false;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  get messageFormValid() {
    const valueWithoutSpaces = this.messageForm.value?.replace(/^\n|\n$/g, '').trim();
    return valueWithoutSpaces && this.messageForm.valid;
  }

  get darkMode() {
    return this.event.theme.darkMode;
  }

  upload(event: any) {
    const reader = new FileReader();
    const [file] = event.target.files;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgSrc = reader.result as string;
      this.store.dispatch(MessengerActions.upload({ eventId: this.event.id, file }));
    };

    setTimeout(() => this.scrollIntoView(), 100);
  }

  send() {
    this.store.dispatch(
      MessengerActions.send({
        event: {
          eventId: this.event.id,
          text: this.messageForm.value,
          ...(this.activeReply && {
            reply: true,
            replyTo: this.replyToMessage.sender.nickname,
            originalMessage: this.replyToMessage.text,
          }),
        },
      }),
    );
    this.messageForm.reset();
    this.activeReply = false;
  }

  keypress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.messageForm.valid) {
        this.send();
      }
    }
  }

  addEmoji({ emoji }: EmojiEvent) {
    this.messageForm.patchValue(`${this.messageForm.value || ''}${emoji.native}`);
  }

  scrollIntoView() {
    scrollIntoView(this.messageContainer?.nativeElement, {
      behavior: 'smooth',
      block: 'end',
    });
  }

  scrollToBottom() {
    this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
  }
}
