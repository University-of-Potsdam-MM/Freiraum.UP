import {
  AfterViewInit,
  Component,
  Input,
  ViewChild
} from '@angular/core';
import {Events, Slides} from "ionic-angular";
import {ConfigProvider, IProgress} from "../../providers/config/config";
import {Logger, LoggingService} from "ionic-logging-service";
import {IAppConfig} from "../../interfaces/IAppConfig";
import * as moment from 'moment';
import {Observable} from "rxjs";
import {IPageConfig} from "../../interfaces/IPageConfig";

/**
 *
 */
@Component({
  selector: 'page-switcher-loading-bar',
  templateUrl: 'page-switcher-loading-bar.html'
})
export class PageSwitcherLoadingBarComponent {

  @Input("progress") progress:number;
  constructor() {}
}


/** ~~~~~~ Main sub-components of menu */

/**
 *
 */
@Component({
  selector: 'header-menu',
  templateUrl: 'header-menu.html'
})
export class HeaderMenuComponent implements AfterViewInit {

  config:IAppConfig = ConfigProvider.config;

  @Input("pageList") pageList:IPageConfig[];

  /**
   */
  @ViewChild(Slides) slides:Slides;

  /**
   */
  @ViewChild(PageSwitcherLoadingBarComponent) loadingBar:PageSwitcherLoadingBarComponent;

  /**
   * @desc logger instance of this class
   */
  logger:Logger;

  /**
   * @desc name of the currently selected slide
   */
  selectedSlide:string;

  selectedIndex:number;

  /**
   * @desc tells whether the currently active page is a special page
   */
  onSpecialPage:boolean = false;

  /**
   * @desc used to set a timeout to know when slide dragging has ended
   */
  slideDragTimer;

  now:string;


  constructor(private events: Events,
              private logging: LoggingService) {
    this.logger = this.logging.getLogger("FreiraumUP.MenuComponent");
  }

  /**
   * @desc selects a page
   * @param pageName
   */
  goToSpecialPage(pageName){
    this.selectedSlide = pageName;
    this.onSpecialPage = true;
    this.events.publish(
      "userInput:clickedButton",
      {name: pageName}
    );
    this.events.publish(
      "page:changeTo",
      {page: pageName, visibleSlides: this.getVisibleSlides()}
    )
  }

  /**
   * @desc returns the slides that are currently visible
   */
  getVisibleSlides(){
    let visibleSlides = [];
    const addSlides = (slides:IPageConfig[]) => {visibleSlides = visibleSlides.concat(slides)};
    const nextIndex =  this.selectedIndex + this.slides.slidesPerView;
    if (nextIndex < this.pageList.length) {
      addSlides(this.pageList.slice(this.selectedIndex, nextIndex));
    } else {
      addSlides((this.pageList.slice(this.selectedIndex)));
      addSlides((this.pageList.slice(0, this.slides.slidesPerView-visibleSlides.length)));
    }
    return visibleSlides;
  }

  /**
   * @desc triggered when active slide changed
   * @param event
   */
  onIonSlideDidChange(event:Slides){
    this.selectedSlide = this.pageList[event.realIndex].name;
    this.selectedIndex = event.realIndex;
    this.onSpecialPage = false;

    this.events.publish(
      "page:changeTo",
      {page: this.selectedSlide, visibleSlides: this.getVisibleSlides()}
    );
  }

  /**
   * @desc fired when any slide is tapped. Only used for detecting whether a slide
   * has been clicked that actually is already active but not visible because
   * a hidden page is shown at the moment. If so the clicked page will be selected
   * again
   * @param event
   */
  onSlideTapped(event:Slides){
    this.events.publish(
      "userInput:clickedSlide",
      {name: this.pageList[event.realIndex].name}
    );

    if(this.onSpecialPage){
      this.selectedSlide = this.pageList[event.realIndex].name;
      this.events.publish(
        "page:changeTo",
        {page: this.selectedSlide, visibleSlide: this.getVisibleSlides()}
      );
    }
  }

  /**
   * @desc triggered when slide is dragged. Logs this event to LRS
   * @param event
   */
  onSlideDragged(event) {
    if(this.slideDragTimer) {
      clearTimeout(this.slideDragTimer)
    }
    this.slideDragTimer = setTimeout(
      () => {
        this.events.publish(
          "userInput:draggedSlide",
          {name: this.pageList[event.realIndex].name}
        )
      },
      500
    );
  }

  /**
   * @param triggered by next button, selects next slide
   */
  onNextClicked(){
    this.events.publish(
      "userInput:clickedButton",
      {name: "next"}
    );
    this.slides.slideNext();
  }

  /**
   * @param triggered by previous button, selects previous slide
   */
  onPreviousClicked(){
    this.events.publish(
      "userInput:clickedButton",
      {name: "previous"}
    );
    this.slides.slidePrev();
  }

  /**
   */
  ngAfterViewInit(): void {
    this.slides.slidesPerView = 7;
    this.slides.centeredSlides = false;
    this.slides.loop = true;
    this.slides.slideToClickedSlide = true;

    Observable.interval(1000).subscribe(
      n => {
        this.now = moment().format("LLL");
      }
    )

    ConfigProvider.progress.subscribe(
      (p:IProgress) => {
        this.loadingBar.progress = p.progress;
        if(p.nextSlide) {
          this.slides.slideNext();
        }
      }
    );
  }
}
