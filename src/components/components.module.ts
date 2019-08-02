import { NgModule } from '@angular/core';
import { TransportComponent } from './transport/transport';
import {IonicModule} from "ionic-angular";
import { NewsComponent } from './news/news';
import { NewsArticleComponent } from './news-article/news-article';
import { MenuComponent } from './menu/menu';
import { PageSlidesComponent } from './page-slides/page-slides';
import { RoomsFreeComponent } from './rooms-free/rooms-free';
import { RoomsBookedComponent } from './rooms-booked/rooms-booked';
import { CampusMapComponent } from './campus-map/campus-map';
import {TranslateModule} from "@ngx-translate/core";
import { MensaComponent } from './mensa/mensa';
import {
  HeaderMenuComponent,
  PageSwitcherLoadingBarComponent
} from './header/header';
import {HintComponent} from "./hint/hint";
import {DynamicModule} from "ng-dynamic-component";
import { TimeoutModalComponent } from './timeout-modal/timeout-modal';
import { SettingsComponent } from './settings/settings';
import { ResultsComponent } from './results/results';
import { EventsComponent } from './events/events';
import {DirectivesModule} from "../directives/directives.module";
import { ReactionComponent } from './reaction/reaction';

@NgModule({
	declarations: [
	  TransportComponent,
    NewsComponent,
    NewsArticleComponent,
    MenuComponent,
    PageSlidesComponent,
    RoomsFreeComponent,
    RoomsBookedComponent,
    CampusMapComponent,
    MensaComponent,
    HeaderMenuComponent,
    PageSwitcherLoadingBarComponent,
    HintComponent,
    TimeoutModalComponent,
    SettingsComponent,
    ResultsComponent,
    EventsComponent,
    ReactionComponent
  ],
	imports: [IonicModule, TranslateModule.forRoot(), DynamicModule, DirectivesModule],
	exports: [
	  TransportComponent,
    NewsComponent,
    NewsArticleComponent,
    MenuComponent,
    PageSlidesComponent,
    RoomsFreeComponent,
    RoomsBookedComponent,
    CampusMapComponent,
    MensaComponent,
    HeaderMenuComponent,
    PageSwitcherLoadingBarComponent,
    HintComponent,
    TimeoutModalComponent,
    SettingsComponent,
    ResultsComponent,
    EventsComponent,
    ReactionComponent
  ],
  entryComponents: []
})
export class ComponentsModule {}
