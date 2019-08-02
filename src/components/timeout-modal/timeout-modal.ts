import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";
import {Observable} from "rxjs";
import {ConfigProvider} from "../../providers/config/config";

/**
 * Component for TimeoutModal
 */
@Component({
  selector: 'timeout-modal',
  templateUrl: 'timeout-modal.html'
})
export class TimeoutModalComponent {

  /**
   * holds the current timeout observable
   */
  timeout;

  /**
   * the amount of time the timeout will take
   */
  timeRemaining = ConfigProvider.config.general.timeout_modal_countdown_time;

  /**
   * the animations name
   */
  animationName = "crescent";

  /**
   * the animations duration
   */
  animationDuration = 2000;

  /**
   * @param viewCtrl
   */
  constructor(private viewCtrl: ViewController) {
    this.timeout = Observable.interval(1000).subscribe(
      n => {
        if(--this.timeRemaining <= 0) {
          this.dismiss({reason: "no_cancel", remaining: 0});
        }
      }
    );
  }

  /**
   * cancels the current timeout by user interaction and dismisses the modal
   */
  cancelTimeout(){
    this.timeout.unsubscribe();
    this.dismiss({reason: "cancel", remaining: this.timeRemaining});
  }

  /**
   * dismisses the modal and passes on data
   * @param data
   */
  dismiss(data){
    this.viewCtrl.dismiss(data);
  }

}
