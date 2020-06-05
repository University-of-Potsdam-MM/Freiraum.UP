import { Injectable } from '@angular/core';
import {ConfigService} from '../config/config.service';
import {Observable, Subject, timer} from 'rxjs';
import * as moment from 'moment';

/**
 * This service manages various timing tasks in the background.
 * With the method 'startAll()' all timers are started at once.
 * The timers can then be observed via ReplaySubject form the outside.
 */
@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private progressTimer;
  private timeslotTimer;
  private timeoutTimer;

  /* these subjects are regularly updated by the timers of this service */
  public now: Subject<string> = new Subject<string>();
  public progress: Subject<number> = new Subject<number>();
  public timeoutEnded: Subject<void> = new Subject<void>();
  public showNextPage: Subject<void> = new Subject<void>();

  protected config = ConfigService.config;

  /* timeslots containing the current timeslot and the next timeslot. Timeslots always span 2 hours. */
  public timeslots = {
    now: {begin: '', end: ''},
    soon: {begin: '', end: ''}
  };

  constructor() {}

  /**
   * starts all timers at once
   */
  startAll() {
    this.startNowTimer();
    this.startTimeslotUpdate();
    this.startProgressTimer();
  }

  /**
   * starts the timer responsible for displaying the current time. The time is displayed in the frontend.
   */
  startNowTimer() {
    timer(0, this.config.general.time_update_frequency * 1000).subscribe(
      n => {
        this.now.next(moment().format(this.config.general.time_format));
      }
    );
  }

  /**
   * starts the timer responsible for updating the progress value. This value is used to display a progress
   * bar in the frontend.
   */
  startProgressTimer() {
    this.progressTimer = timer(0, 1000).subscribe(
      n => {
        // guard for undefined state
        if (n <= 0) { return; }

        const seconds = (n % this.config.general.page_switching_frequency);
        const shouldShowNextPage = (seconds === 0);
        const progress = (seconds / this.config.general.page_switching_frequency);

        if (shouldShowNextPage) { this.showNextPage.next(); }
        this.progress.next(progress);
      }
    );
  }

  /**
   * stops the progress timer and sets it to zero. Is used only in interactive mode to stop the application upon
   * user input.
   */
  stopProgressTimer() {
    this.progressTimer.unsubscribe();
    this.progress.next(0);
  }

  /**
   * starts the timer responsible for updating the timeslots. A timeslot always spans two hours.
   */
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

  /**
   * starts the timeout timer when user input is registered. Each subsequent user input resets the timer
   */
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
