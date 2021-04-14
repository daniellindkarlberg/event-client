import { Pipe, PipeTransform } from '@angular/core';
import { Autolinker } from 'autolinker';

@Pipe({
  name: 'link',
})
export class LinkPipe implements PipeTransform {
  transform(text: string): string {
    return Autolinker.link(text);
  }
}
