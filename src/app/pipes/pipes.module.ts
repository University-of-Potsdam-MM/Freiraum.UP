import { NgModule } from '@angular/core';
import {PageNamePipe} from './page-name/page-name.pipe';
import {TimeslotPipe} from './timeslot/timeslot.pipe';

@NgModule({
  declarations: [
    PageNamePipe,
    TimeslotPipe
  ],
  imports: [],
  exports: [
    PageNamePipe,
    TimeslotPipe
  ]
})

export class PipesModule {}
