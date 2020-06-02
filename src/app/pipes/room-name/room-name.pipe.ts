import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'roomName'
})
export class RoomNamePipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: string, ...args: any[]): any {
    const parts = value.split('.');
    console.log(parts);
    let parsed = '';
    switch (parts.length) {
      case 3: {
        if (parts[2].includes('S')) {
          parsed = `${this.translate.instant('words.seminar_room')} ${parts[2].slice(1)}`;
        }
        if (parts[2].includes('H')) {
          parsed = `${this.translate.instant('words.lecture_room')} ${parts[2].slice(1)}`;
        }
        break;
      }
      case 4: {
        parsed = `${this.translate.instant('words.room')} ${parts[2]}.${parts[3]}`;
        break;
      }
      default: {
        parsed = value;
      }
    }
    return parsed;
  }

}
