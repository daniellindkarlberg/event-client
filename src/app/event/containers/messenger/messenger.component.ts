import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessengerActions } from '@core/actions';
import { Message } from '@core/models';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EventActions } from '@event/actions';
import { Mode, Theme } from '@event/models';
import { select, Store } from '@ngrx/store';
import {
  getMessages,
  getMessagesLoading,
  getUser,
  selectCurrentEvent,
  State,
} from '@root/reducers';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
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
export class MessengerComponent implements AfterViewInit, OnInit, OnDestroy {
  Mode = Mode;

  @ViewChild('content') content = {} as ElementRef;
  @ViewChild('messageContainer') messageContainer = {} as ElementRef;

  loading$ = this.store.pipe(select(getMessagesLoading));
  notification$ = new BehaviorSubject<boolean>(false);
  destroy$: Subject<boolean> = new Subject<boolean>();

  eventId = '';
  userId = '';
  theme = {} as Theme;
  messages: Message[] = [];
  messageForm = new FormControl('', Validators.required);
  currentUser = false;
  showEmoticons = false;
  showFullSizeImage = false;
  showHeader = true;
  inView = true;
  imgSrc = '';
  fullSizeImageUrl = '';

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.store
      .pipe(
        select(selectCurrentEvent),
        filter((event) => !!event),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.eventId = event.id;
        this.theme = event.theme;
      });
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
          setTimeout(() => this.scrollToBottom(), 300);
        } else {
          this.notification$.next(true);
        }
      });
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(EventActions.getById({ id: this.eventId, shouldInitMessenger: true }));
    this.store.dispatch(MessengerActions.join({ eventId: this.eventId }));
  }

  ngAfterViewInit() {
    fromEvent(this.content.nativeElement, 'scroll')
      .pipe(
        tap(({ target: { scrollTop, scrollHeight } }) => {
          this.inView = scrollHeight - scrollTop < 1500;
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

  upload(event: any) {
    const reader = new FileReader();
    const [file] = event.target.files;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgSrc = reader.result as string;
      this.store.dispatch(MessengerActions.upload({ eventId: this.eventId, file }));
    };

    setTimeout(() => this.scrollIntoView(), 100);
    this.scrollIntoView();
  }

  send() {
    this.store.dispatch(
      MessengerActions.send({
        event: { eventId: this.eventId, text: this.messageForm.value },
      }),
    );
    this.messageForm.reset();
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

  close() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
