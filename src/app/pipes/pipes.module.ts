import { NgModule } from '@angular/core';
import {PageNamePipe} from './page-name/page-name.pipe';

@NgModule({
  declarations: [
    PageNamePipe
  ],
  imports: [],
  exports: [
    PageNamePipe
  ]
})

export class PipesModule {}
