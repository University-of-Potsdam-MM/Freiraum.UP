import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {timer} from 'rxjs';
import {ConfigService} from '../../../services/config/config.service';

@Component({
  selector: 'app-timeout-modal',
  templateUrl: './timeout-modal.component.html',
  styleUrls: ['./timeout-modal.component.scss'],
})
export class TimeoutModalComponent implements OnInit {

  timeout;

  config = ConfigService.config;

  timeRemaining = this.config.general.timeout_modal_countdown_time;

  /**
   * the animations name
   */
  animationName = 'crescent';

  /**
   * the animations duration
   */
  animationDuration = 2000;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.timeout = timer(0, 1000).subscribe(
      n => {
        this.timeRemaining = this.timeRemaining - 1;
        if (this.timeRemaining <= 0) {
          this.dismissByTimeout();
        }
      }
    );
  }

  dismissByInteraction() {
    this.modalCtrl.dismiss({reason: 'interaction'});
  }

  dismissByTimeout() {
    this.modalCtrl.dismiss({reason: 'timeout'});
  }

}
