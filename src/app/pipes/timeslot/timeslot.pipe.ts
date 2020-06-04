import { Pipe, PipeTransform } from '@angular/core';
import {TimerService} from '../../services/timer/timer.service';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeslot'
})
export class TimeslotPipe implements PipeTransform {

  constructor(private timerservice: TimerService,
              private translate: TranslateService) {
  }

  transform(value: any, ...args: any[]): any {
      return `${this.translate.instant(`words.${value}`)}`
             + ` (${moment(this.timerservice.timeslots[value].begin).format('HH:mm')}`
             + `- ${moment(this.timerservice.timeslots[value].end).format('HH:mm')})`;
  }

}
