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
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {ScreenSaverComponent} from './home-components/screen-saver/screen-saver.component';

/**
 * This component contains the actual application. It consists of two elements:
 *
 * - The header area contains information about the location and the current time.
 * - The content area contains the selected page
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [BreakpointObserver]
})
export class HomePage implements AfterViewInit {

  config = ConfigService.config;
  screenSaverModal;

  /* Gets the pages that are to be used in the application */
  pages: PageItem[] = this.pageService.pages;

  /* Whether the application is currently running in landscape format */
  landscape = false;

  /* Defines the current width of the content area. Must be a string because the value is directly used as CSS-value  */
  contentWidthPercent = '100%';

  /* Defines how much slide are to be seen at the same time in interactive mode  */
  visibleSlides = 3;

  /* Contains the current progress value used by the progress-bar */
  progress: number;

  constructor(private pageService: PagesService,
              private timer: TimerService,
              private modalController: ModalController,
              private breakpointObserver: BreakpointObserver) {}

  ngAfterViewInit() {
    // Adds EventListeners for click and scroll events. Those events will trigger a timeout-timer in interactive mode.
    window.addEventListener('click', () => this.timer.startTimeout());
    window.addEventListener('scroll', () => this.timer.startTimeout());

    // Show timeout modal when timeout has ended
    this.timer.timeoutEnded.subscribe(() => this.showTimeoutModal());

    // Use progress value from TimerService for progress-bar
    this.timer.progress.subscribe(p => this.progress = p);

    // Observes the width of the application and sets the landscape variable accordingly
    this.breakpointObserver
      .observe([`(max-width: ${this.config.general.layout.breakpoint_landscape}px)`])
      .subscribe((state: BreakpointState) => {
        this.landscape = !state.matches;
        this.contentWidthPercent = this.landscape
          ? this.config.general.layout.content_width_landscape
          : '100%';
        this.visibleSlides = this.landscape ? 5 : 3;
      });

    this.timer.isInOperationTime.subscribe(
      inOperationTime => { this.showScreenSaverModal(inOperationTime); }
    );
  }

  /**
   * Shows the timeout-modal when the TimerServices timeout has ended
   */
  async showTimeoutModal() {
    const modal = await this.modalController.create({
      component: TimeoutModalComponent
    });
    modal.onDidDismiss()
      .then(dismissed => {
        if (dismissed.data.reason === 'cancel') {
          // nothing to do
        }
        if (dismissed.data.reason === 'timeout') {
          this.timer.startProgressTimer();
        }
      });
    await modal.present();
  }

  async showScreenSaverModal(inOperationTime) {
    if (!inOperationTime) {
      if (this.screenSaverModal === null) {
        this.screenSaverModal = await this.modalController.create({
          component: ScreenSaverComponent,
          cssClass: 'fullscreen-modal'
        });
        await this.screenSaverModal.present();
      }
    } else {
      if (this.screenSaverModal !== null) {
        this.screenSaverModal.dismiss();
      }
    }
  }
}
