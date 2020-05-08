import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Observable, Subscription, timer} from 'rxjs';
import {ConfigService} from '../../../services/config/config.service';

/**
 * This component displays a window with a countdown. If the countdown is interrupted by the user or the timeout reaches
 * zero the modal is dismissed again.
 */
@Component({
  selector: 'app-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['./timeout-modal.component.scss'],
})
export class TimeoutModalComponent implements OnInit {

  config = ConfigService.config;

  /* contains the timeout timer after it has been started */
  timeout;

  /* contains the timer after it has been started */
  timer;

  /* time remaining for the modal */
  timeRemaining = this.config.general.timeout_modal_countdown_time;

  /* the animations name */
  animationName = 'crescent';

  /* the animations duration */
  animationDuration = 2000;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.timer = timer(0, 1000);
    this.timeout = this.timer.subscribe(
      n => {
        this.timeRemaining = this.timeRemaining - 1;
        if (this.timeRemaining <= 0) {
          this.dismissByTimeout();
        }
      }
    );
  }

  stopTimer() {
    this.timeout.unsubscribe();
    clearTimeout(this.timeout);
    this.timeout = null;
  }

  /**
   * dismisses the modal with reason 'interaction
   */
  async dismissByInteraction() {
    this.stopTimer();
    await this.modalCtrl.dismiss({reason: 'interaction'});
  }

  /**
   * dismisses the timeout by reason 'timeout'
   */
  async dismissByTimeout() {
    this.stopTimer();
    await this.modalCtrl.dismiss({reason: 'timeout'});
  }

}
