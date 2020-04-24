import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PagesService} from '../../../services/pages/pages.service';
import {IonSlides} from '@ionic/angular';
import {ConfigService} from '../../../services/config/config.service';
import {TimerService} from '../../../services/timer/timer.service';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [BreakpointObserver]
})
export class MenuComponent implements OnInit {

  @Output() touched: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(IonSlides, {static: false}) slides: IonSlides;

  pageList = this.pages.pages;
  progress;
  config = ConfigService.config;

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

  slidesOptions = {
    slidesPerView: this.visibleSlides,
    centeredSlides: true,
    loop: true,
    loopedSlides: this.visibleSlides,
    loopAdditionalSlides: this.visibleSlides,
    slideToClickedSlide: true
  };

  constructor(private pages: PagesService,
              private timer: TimerService) {
    this.visibleSlides = 3;
  }

  ngOnInit(): void {
    this.timer.showNextPage.subscribe(next => this.slides.slideNext());
    this.timer.progress.subscribe(p => { this.progress = p; });
  }

  onIonSlideDidChange(event) {
    this.pages.setSelected(event.target.swiper.realIndex);
  }

  onTouchEvent() {
    this.touched.emit();
  }
}
