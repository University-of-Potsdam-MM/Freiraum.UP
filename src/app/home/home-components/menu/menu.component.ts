import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PagesService} from '../../../services/pages/pages.service';
import {IonSlides} from '@ionic/angular';
import {ConfigService} from '../../../services/config/config.service';
import {TimerService} from '../../../services/timer/timer.service';
import {BreakpointObserver} from '@angular/cdk/layout';

/**
 * This component displays an interactive menu in interactive mode and an active page indicator in non interactive mode.
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [BreakpointObserver]
})
export class MenuComponent implements OnInit {

  config = ConfigService.config;

  /* contains value for progress bar */
  @Input() progress;

  /* gives access to ion-slides component */
  @ViewChild(IonSlides, {static: false}) slides: IonSlides;

  /* uses global pagesConfig object to retrieve list of available pages */
  pageList = this.pages.pages;

  /* setter for setting the number of visible slides */
  @Input() set visibleSlides(slides) {
    this.slidesOptions = {
      slidesPerView: slides,
      centeredSlides: true,
      loop: true,
      loopedSlides: slides,
      loopAdditionalSlides: slides,
      slideToClickedSlide: true
    };
  }

  /* options for the ion-slides component */
  slidesOptions = {
    // slides visible per view
    slidesPerView: this.visibleSlides,
    // centers the currently selected slide
    centeredSlides: true,
    // makes the slides loop
    loop: true,
    // number of slides to loop
    loopedSlides: this.visibleSlides,
    // number of additional slides to be shown for looping
    loopAdditionalSlides: this.visibleSlides,
    // if a slide is clicked it will be selected
    slideToClickedSlide: true
  };

  constructor(private pages: PagesService,
              private timer: TimerService) {
    this.visibleSlides = 3;
  }

  ngOnInit(): void {
    // select next slide when progress reaches 100%
    this.timer.showNextPage.subscribe(next => this.slides.slideNext());
    // use progress from TimerService in progress-bar
    this.timer.progress.subscribe(p => { this.progress = p; });
  }

  onIonSlideDidChange(event) {
    // set slide as selected when it has been selected. This is used so we can tell an instance of a page
    // that it has been selected
    this.pages.setSelected(event.target.swiper.realIndex);
  }
}
