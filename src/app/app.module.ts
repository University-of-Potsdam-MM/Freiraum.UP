import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NewsComponent } from "../components/news/news";
import { WebServiceProvider } from '../providers/web-service/web-service';
import { ConfigProvider } from "../providers/config/config";
import { ConnectionProvider } from '../providers/connection/connection';
import { Network } from "@ionic-native/network";
import { LoggingService } from "ionic-logging-service";

/* pages and components */

import {FreiraumUP} from './app.component';
import { ComponentsModule } from "../components/components.module";
import { TransportComponent } from "../components/transport/transport";
import { RoomsFreeComponent } from "../components/rooms-free/rooms-free";
import { RoomsBookedComponent } from "../components/rooms-booked/rooms-booked";
import { CampusMapComponent } from "../components/campus-map/campus-map";
import {MensaComponent} from "../components/mensa/mensa";
import {DynamicModule} from "ng-dynamic-component";
import {TimeoutModalComponent} from "../components/timeout-modal/timeout-modal";
import {SettingsComponent} from "../components/settings/settings";
import {EventsComponent} from "../components/events/events";
import {ReactionComponent} from "../components/reaction/reaction";
import {IonicStorageModule} from "@ionic/storage";

/**
 * @desc initializes config for ConfigProvider before app starts
 * @param {ConfigProvider} config
 */
export function initConfig(config:ConfigProvider) {
  let load = () => {
    let l = config.load();
    return l;
  };
  return load;
}

/**
 * @desc creates the TranslateHttpLoader for i18n
 * @param {HttpClient} http
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    FreiraumUP
  ],
  imports: [
    ComponentsModule,
    BrowserModule,
    IonicModule.forRoot(FreiraumUP),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    DynamicModule.withComponents([
      NewsComponent,
      TransportComponent,
      RoomsFreeComponent,
      RoomsBookedComponent,
      CampusMapComponent,
      MensaComponent,
      SettingsComponent
    ])
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FreiraumUP,
    NewsComponent,
    TransportComponent,
    RoomsFreeComponent,
    RoomsBookedComponent,
    CampusMapComponent,
    MensaComponent,
    TimeoutModalComponent,
    SettingsComponent,
    EventsComponent,
    ReactionComponent
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigProvider],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    StatusBar,
    SplashScreen,
    ConfigProvider,
    ConnectionProvider,
    Network,
    LoggingService,
    WebServiceProvider
  ]
})
export class AppModule {}
