import {
  AfterViewInit,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import {Slides} from "ionic-angular";
import {Logger, LoggingService} from "ionic-logging-service";
import {Observable} from "rxjs";
import {IAppConfig} from "../../interfaces/IAppConfig";
import {ConfigProvider} from "../../providers/config/config";

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent implements AfterViewInit {

  timerRunning:boolean = true;
  config:IAppConfig = ConfigProvider.config;
  logger:Logger;
  @Input("pages") pages;
  @Input("slides") contentSlides:Slides;
  @ViewChild(Slides) slides:Slides;

  constructor(logging: LoggingService) {
    this.logger = logging.getLogger("FreiraumUP.Menu")
  }

  slideTapped(event){
    this.logger.info("slideTo", event.clickedIndex);
    this.slides.slideTo(event.clickedIndex);
    this.contentSlides.slideTo(event.clickedIndex);
  }

  willChange(event){
    this.logger.info("willChange", event.clickedIndex);
    this.contentSlides.slideTo(event.clickedIndex);
  }

  slideToPrevious(event){
    this.logger.info("slideToPrevious");
    this.contentSlides.slideTo(event.realIndex);

    this.slides.slidePrev();
  }

  slideToNext(event){
    this.logger.info("slideToNext");
    this.contentSlides.slideTo(event.realIndex);

    this.slides.slideNext();
  }

  /**
   * @desc starts a timer that slides to the next slide every n seconds.
   * Also makes the menu icons switch.
   */
  private startTimer(){
    Observable.timer(
      this.config.general.page_switching_frequency*1000,
      this.config.general.page_switching_frequency*1000
    ).subscribe(
      nextValue => {
        if(this.timerRunning){
          if(this.slides.isEnd()){
            this.slides.slideTo(0)
          } else {
            this.slides.slideNext();
          }
        }
      }
    )
  }

  ngAfterViewInit(): void {
    this.slides.centeredSlides = true;
    this.slides.slidesPerView = 5;
    this.startTimer();
  }

}
