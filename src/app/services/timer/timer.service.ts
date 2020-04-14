import { Injectable } from '@angular/core';
import {ConfigService} from '../config/config.service';
import {Observable, Subject, timer} from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  progressTimer;
  timeslotTimer;
  timeoutTimer;

  now: Subject<string> = new Subject<string>();
  progress: Subject<number> = new Subject<number>();
  timeoutEnded: Subject<void> = new Subject<void>();
  showNextPage: Subject<boolean> = new Subject<boolean>();

  protected config = ConfigService.config;

  public timeslots = {
    now: {begin: '', end: ''},
    soon: {begin: '', end: ''}
  };

  constructor() {}

  startAll() {
    this.startNowTimer();
    this.startTimeslotUpdate();
    this.startProgressTimer();
  }


  startNowTimer() {
    timer(0, this.config.general.time_update_frequency * 1000).subscribe(
      n => {
        this.now.next(moment().format('lll'));
      }
    );
  }

  startProgressTimer() {
    this.progressTimer = timer(0, 1000).subscribe(
      n => {
        // guard for undefined state
        if (n <= 0) { return; }

        const seconds = n % this.config.general.page_switching_frequency;
        const shouldShowNextPage = seconds === 0;
        const progress = Math.trunc((seconds / this.config.general.page_switching_frequency) * 100);

        if (shouldShowNextPage) { this.showNextPage.next(true); }
        this.progress.next(progress);
      }
    );
  }

  stopProgressTimer() {
    this.progressTimer.unsubscribe();
    this.progress.next(0);
  }

  startTimeslotUpdate() {
    this.timeslotTimer = timer(0, this.config.general.timeslot_update_frequency * 1000).subscribe(
      n => {
        const timeSlotDuration = moment.duration(2, 'hours');

        const nowBegin = moment()
          .set('hours', Math.floor(moment().get('hours') / 2) * 2)
          .set('minutes', 0)
          .set('seconds', 0)
          .set('milliseconds', 0);

        const soon = nowBegin.clone().add(timeSlotDuration);
        const soonEnd = soon.clone().add(timeSlotDuration);

        this.timeslots.now.begin = nowBegin.toISOString(false);
        this.timeslots.now.end = soon.toISOString(false);
        this.timeslots.soon.begin = soon.toISOString(false);
        this.timeslots.soon.end = soonEnd.toISOString(false);
      }
    );
  }

  startTimeout() {
    if (this.config.general.interactiveMode) {
      this.stopProgressTimer();

      if (this.timeoutTimer) {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = null;
      }

      this.timeoutTimer = setTimeout(
        () => { this.timeoutEnded.next(); },
        this.config.general.timeout_time * 1000
      );
    }
  }
}
