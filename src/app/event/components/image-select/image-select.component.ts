import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Image } from '@event/models';
import { fromEvent, Subscription } from 'rxjs';
import { filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-image-select',
  templateUrl: './image-select.component.html',
  styleUrls: ['./image-select.component.scss'],
})
export class ImageSelectComponent implements OnInit, OnDestroy {
  @Input() set src(src: string) {
    this.imageSrc = src;
    if (src) {
      this.showInfo = true;
    }
  }
  @Output() positionChange = new EventEmitter<number>();
  @Output() fileChange = new EventEmitter<Image>();
  @Output() fileReset = new EventEmitter<void>();

  @ViewChild('trackerRef', { static: true, read: ElementRef })
  trackerRef = {} as ElementRef;

  subscription = new Subscription();
  mouseMove$ = fromEvent(document, 'mousemove');
  mouseUp$ = fromEvent(document, 'mouseup');

  imageSrc = '';
  showInfo = false;
  internalValue = 0;
  posY = 0;
  minY = -30;
  maxY = 30;

  select(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.fileChange.emit({ file, imageSrc: this.imageSrc });
      };
    }
  }

  reset() {
    this.imageSrc = '';
    this.showInfo = false;
    this.fileReset.emit();
  }

  ngOnInit() {
    this.subscription.add(
      fromEvent<MouseEvent>(this.trackerRef.nativeElement, 'mousedown')
        .pipe(
          tap(() => (this.showInfo = false)),
          switchMap(({ y: mouseDownY }) =>
            this.mouseMove$.pipe(
              takeUntil(this.mouseUp$),
              finalize(() => (this.internalValue = this.posY)),
              map(({ y: mouseMoveY }: MouseEvent) => Math.floor(mouseMoveY - mouseDownY)),
              filter(
                (posY) =>
                  posY + this.internalValue < this.maxY && posY + this.internalValue > this.minY,
              ),
            ),
          ),
        )
        .subscribe((value) => {
          this.posY = value + this.internalValue;
          this.positionChange.emit(this.posY);
        }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
