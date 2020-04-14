import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {TranslateService} from '@ngx-translate/core';
import {TimerService} from './services/timer/timer.service';
import * as moment from 'moment';
import {ConfigService} from './services/config/config.service';

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
    private timer: TimerService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.translate.setDefaultLang(ConfigService.config.general.default_language);
    moment.locale(ConfigService.config.general.default_language);
    this.timer.startAll();

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
