import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {PagesService} from '../../../services/pages/pages.service';
import {IonSlides} from '@ionic/angular';
import {LoadingbarComponent} from '../loadingbar/loadingbar.component';
import {ConfigService} from '../../../services/config/config.service';
import {TimerService} from '../../../services/timer/timer.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Output() touched: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(IonSlides, {static: false}) slides: IonSlides;

  @ViewChild(LoadingbarComponent, {static: false}) loadingBar: LoadingbarComponent;

  pageList = this.pages.pages;

  config = ConfigService.config;

  visibleSlides = this.config.general.interactiveMode ? 7 : 3;

  slidesOptions = {
    slidesPerView: this.visibleSlides,
    centeredSlides: true,
    loop: true,
    loopedSlides: this.visibleSlides,
    loopAdditionalSlides: this.visibleSlides,
    slideToClickedSlide: true
  };

  constructor(private pages: PagesService,
              private timer: TimerService) { }

  ngOnInit(): void {
    this.timer.showNextPage.subscribe(next => this.slides.slideNext());
  }

  onIonSlideDidChange(event) {
    this.pages.setSelected(event.target.swiper.realIndex);
  }

  onTouchEvent() {
    this.touched.emit();
  }
}
