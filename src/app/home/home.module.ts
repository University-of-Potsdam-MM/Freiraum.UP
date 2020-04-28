import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {DynamicModule} from 'ng-dynamic-component';
import {componentsList} from '../services/pages/pages.service';
import {TranslateModule} from '@ngx-translate/core';
import {HeaderComponent} from './home-components/header/header.component';
import {MenuComponent} from './home-components/menu/menu.component';
import {TimeoutModalComponent} from './home-components/timeout-modal/timeout-modal.component';
import {ResultsComponent} from '../components/results/results';
import {HintComponent} from '../components/hint/hint';
import {ArticleComponent} from '../components/article/article';
import {PipesModule} from '../pipes/pipes.module';
import {LayoutModule} from '@angular/cdk/layout';
import {TransportBarComponent} from './home-components/transport-bar/transport-bar.component';

@NgModule({
  imports: [
    LayoutModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
    ]),
    TranslateModule,
    DynamicModule.withComponents(componentsList()),
    PipesModule
  ],
  declarations: [
    HomePage,
    HeaderComponent,
    MenuComponent,
    TimeoutModalComponent,
    ResultsComponent,
    HintComponent,
    ArticleComponent,
    TransportBarComponent,
    ...componentsList()
  ],
  entryComponents: [
    HeaderComponent,
    MenuComponent,
    TimeoutModalComponent,
    ResultsComponent,
    HintComponent,
    ArticleComponent,
    TransportBarComponent,
    ...componentsList()
  ]
})
export class HomePageModule {}
