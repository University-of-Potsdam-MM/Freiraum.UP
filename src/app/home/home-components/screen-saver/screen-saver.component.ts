import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {TimerService} from '../../../services/timer/timer.service';

@Component({
  selector: 'app-screen-saver',
  templateUrl: './screen-saver.component.html',
  styleUrls: ['./screen-saver.component.scss'],
})
export class ScreenSaverComponent implements OnInit {

  constructor(private modalCtrl: ModalController,
              private timerService: TimerService) { }

  ngOnInit() {
    this.timerService.isInOperationTime.subscribe(
      inOperationTime => {if (inOperationTime) { this.dismiss(); }}
    );
  }

  /**
   * dismisses the modal
   */
  async dismiss() {
    await this.modalCtrl.dismiss('dismiss');
  }

}
