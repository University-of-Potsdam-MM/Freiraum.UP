import {
  AfterViewInit,
  Component
} from '@angular/core';
import {PagesService} from '../services/pages/pages.service';
import {ConfigService} from '../services/config/config.service';
import {PageItem} from '../../types/PageItem';
import {TimerService} from '../services/timer/timer.service';
import {ModalController} from '@ionic/angular';
import {TimeoutModalComponent} from './home-components/timeout-modal/timeout-modal.component';
import {ApiService} from '../services/api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  pages: PageItem[] = this.pageService.pages;
  config = ConfigService.config;

  constructor(private pageService: PagesService,
              private timer: TimerService,
              private modalController: ModalController,
              private api: ApiService) {}

  ngAfterViewInit() {
    this.api.init();
    window.addEventListener('click', () => this.timer.startTimeout());
    window.addEventListener('scroll', () => this.timer.startTimeout());
    this.timer.timeoutEnded.subscribe(() => this.showTimeoutModal());
  }

  async showTimeoutModal() {
    const modal = await this.modalController.create({
      component: TimeoutModalComponent
    });
    await modal.present();
    modal.onDidDismiss()
      .then(dismissed => {
        if (dismissed.data.reason === 'cancel') {
          // nothing to do
        }
        if (dismissed.data.reason === 'timeout') {
          this.timer.startProgressTimer();
        }
      });
  }
}
