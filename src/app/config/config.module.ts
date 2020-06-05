import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigComponent } from './config.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, TranslateModule ],
  declarations: [ConfigComponent],
  exports: [ConfigComponent]
})
export class ConfigComponentModule {}
