import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {iterableArray} from '../../util/iterableArray';
import {ReservedRoomsResponse} from '../../../types/reservedRooms.response';

@Component({
  selector: 'app-lectures-page',
  templateUrl: './lectures-page.component.html',
  styleUrls: ['./lectures-page.component.scss'],
})
export class LecturesPageComponent extends BasicPageComponent implements OnInit {
  keys = Object.keys;
  reservedRooms: {[timeslot: string]: ReservedRoomsResponse} = {};
  timeslotIterator;
  selectedTimeslot;

  constructor() { super('lectures'); }

  ngOnInit() {
    this.timeslotIterator = iterableArray(this.config.lectures.timeslots);
    this.selectedTimeslot = this.config.lectures.timeslots[0];
    for (const timeslot of this.config.lectures.timeslots) {
      this.api.feeds.reservedRooms[timeslot].subscribe(
        (reservedRooms) => {
          this.reservedRooms[timeslot] = reservedRooms;
        }
      );
    }

  }

  onSelected() {
    if (this.timeslotIterator) {
      this.selectedTimeslot = this.timeslotIterator.next().value;
    }
  }

}
