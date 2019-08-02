import {Component} from '@angular/core';
import {Events, ModalController, Platform } from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as moment from 'moment';

// Providers
import {TranslateService} from "@ngx-translate/core";
import {ConfigProvider} from "../providers/config/config";
import {Logger, LoggingService} from "ionic-logging-service";
import {ConnectionProvider} from "../providers/connection/connection";
import {WebServiceProvider} from "../providers/web-service/web-service";

// Interfaces
import {IPageConfig} from "../interfaces/IPageConfig";
import {IAppConfig} from "../interfaces/IAppConfig";

// Pages
import {TransportComponent} from "../components/transport/transport";
import {NewsComponent} from "../components/news/news";
import {CampusMapComponent} from "../components/campus-map/campus-map";
import {RoomsBookedComponent} from "../components/rooms-booked/rooms-booked";
import {RoomsFreeComponent} from "../components/rooms-free/rooms-free";
import {TimeoutModalComponent} from "../components/timeout-modal/timeout-modal";
import {MensaComponent} from "../components/mensa/mensa";
import {ReactionComponent} from "../components/reaction/reaction";

@Component({
  templateUrl: 'app.html'
})
export class FreiraumUP {

  /**
   * @desc shorthand to config
   */
  config:IAppConfig = ConfigProvider.config;

  /**
   * @desc Instance of the logging service
   */
  logger:Logger;

  /**
   * @desc contains the pages that should be shown
   */
  componentsList:IPageConfig[];

  /**
   * @desc holds name of the current page
   */
  currentPage:string;

  /**
   * @desc contains the currently active timeout handle. It is used to clear
   * the timeout after another user interaction
   */
  currentTimeout = null;

  /**
   * @desc contains the currently opened timeout modal
   */
  timeoutModal;

  /**
   * @desc contains the currentl visivle slides. Is updated at every page change
   */
  visibleSlides = [];

  constructor(private platform: Platform,
              private modalCtrl: ModalController,
              private events: Events,
              private ws:WebServiceProvider,
              private logging: LoggingService,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private translate: TranslateService,
              private connection: ConnectionProvider) {

    this.logging.configure({
      logLevels:[
        {
          loggerName: "root",
          logLevel: "TRACE"
        }
      ]
    });
    this.logger = this.logging.getLogger("FreiraumUP");
    this.initializeApp();

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


  /**
   * @desc initializes the components that are to be displayed
   */
  initializeComponents(){

    this.componentsList = [
      {
        component:TransportComponent,
        name:"transport",
        icon:"train"
      },
      {
        component:NewsComponent,
        name: "news",
        icon: "paper"
      },
      {
        component: MensaComponent,
        name: "mensa",
        icon: "pizza"
      },
      {
        component:CampusMapComponent,
        name: "campus-map",
        icon: "map"
      },
      {
        component:RoomsBookedComponent,
        name: "rooms-booked",
        icon: "time"
      },
      {
        component:RoomsFreeComponent,
        name: "rooms-free",
        icon: "square-outline"
      },
      {
        component: ReactionComponent,
        name: "game",
        icon: "game-controller-b"
      }
    ];
  }

  /**
   * @desc handles tasks that are to be done before the app can be used
   */
  initializeApp(){
    moment.locale(this.config.general.default_language);
    this.translate.setDefaultLang(ConfigProvider.config.general.default_language);
    this.translate.use(ConfigProvider.config.general.default_language);
    this.connection.initializeNetworkEvents();
    this.ws.initializeCalls();
    this.initializeComponents();

    for(let eventName of ["touchstart", "click", "scroll"]) {
      document.addEventListener(
        eventName,
        (event)=>{
          if(!this.timeoutModal){
            this.startTimeoutTimer();
          }
        }
      );
    }

    this.events.subscribe(
      "page:changeTo",
      (args:{page:string, visibleSlides:IPageConfig[]}) => {
        this.visibleSlides = args.visibleSlides;
        this.currentPage = args.page;
        ConfigProvider.currentPage = args.page;
      }
    );
  }

  /**
   * creates and presents a TimeoutModal
   *
   * @desc The modal will be dismissed automatically after it's internal timeout
   * has ended or when the user interacts with it. When the modal has been
   * dismissed the application will either continue in automatic mode or remain
   * in interactive mode.
   */
  showTimeoutModal(){
	this.currentTimeout = null;
    this.timeoutModal = this.modalCtrl.create(
      TimeoutModalComponent,
      {},
      {enableBackdropDismiss: false}
    );
    this.timeoutModal.onDidDismiss(
      (data:{reason:string, remaining:number}) => {
        if(data.reason == "cancel"){
          // actually nothing to do because the session has not ended
          this.startTimeoutTimer();
        }
        if(data.reason == "no_cancel"){
          // restart the progress timer again, the session has ended
          this.events.publish('reset');
          ConfigProvider.prototype.startProgressTimer();
        }
        // remove current modal
        this.timeoutModal = null;
      }
    );
    this.timeoutModal.present();
  }

  /**
   * starts the timeout timer
   * @desc This function is called after every user
   * interaction. So we're treating every interaction as the 'last' interaction.
   */
  startTimeoutTimer(){
    ConfigProvider.prototype.stopProgressTimer();
    if(this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.currentTimeout = setTimeout(
      ()=>{ this.showTimeoutModal() },
      ConfigProvider.config.general.timeout_time*1000
    );
  }
}
