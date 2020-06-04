import { NgModule } from '@angular/core';
import {PageNamePipe} from './page-name/page-name.pipe';
import {TimeslotPipe} from './timeslot/timeslot.pipe';
import { RoomNamePipe } from './room-name/room-name.pipe';

@NgModule({
  declarations: [
    PageNamePipe,
    TimeslotPipe,
    RoomNamePipe
  ],
  imports: [],
  exports: [
    PageNamePipe,
    RoomNamePipe,
    TimeslotPipe
  ]
})

export class PipesModule {}
