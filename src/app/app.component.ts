import { Component } from '@angular/core';
import { Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {TimerService} from './services/timer/timer.service';
import * as moment from 'moment';
import {ConfigService} from './services/config/config.service';
import {Title} from '@angular/platform-browser';
import {ApiService} from "./services/api/api.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private timer: TimerService,
    private title: Title,
    private api: ApiService
  ) {
    this.initializeApp();
  }

  /**
   * Initializes the complete application
   */
  initializeApp() {
    // Set default language to the selected one
    this.translate.setDefaultLang(ConfigService.config.general.default_language);

    // Set default time locale to selected one
    moment.locale(ConfigService.config.general.default_language);

    // Starts all background timer for progress, page switching, network requests etc.
    this.timer.startAll();

    // Sets the browser tabs title
    this.title.setTitle(
      `Freiraum.UP, Haus ${ConfigService.config.general.location.building}, ${ConfigService.config.general.location.campus_name}`
    );

    // Initializes the API service
    this.api.init();

    // Calls ionics own methods for hiding the splashscreen once the app is initialized
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
