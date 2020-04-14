import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';

@Component({
  selector: 'app-reserved-rooms-page',
  templateUrl: './reserved-rooms-page.component.html',
  styleUrls: ['./reserved-rooms-page.component.scss'],
})
export class ReservedRoomsPageComponent extends BasicPageComponent implements OnInit {

  reservedRooms = {};

  constructor() { super(); }

  ngOnInit() {
    for (const timeslot of ['now', 'soon']) {
      this.api.feeds.reservedRooms[timeslot].subscribe(
        (reservedRooms) => {
          this.reservedRooms[timeslot] = reservedRooms;
        }
      );
    }
  }

}
