import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {FreeRoomsResponse} from '../../../types/freeRooms.response';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.scss'],
})
export class RoomsPageComponent extends BasicPageComponent implements OnInit {

  rooms = {};

  constructor() { super(); }

  ngOnInit() {
    for (const timeslot of ['now', 'soon']) {
      this.api.feeds.freeRooms[timeslot].subscribe(
        (response) => {
          this.rooms[timeslot] = response;
        }
      );
    }
  }

}
