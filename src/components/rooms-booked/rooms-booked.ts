import {Component, OnInit} from '@angular/core';
import {IRoomReservation} from "../../interfaces/IRoomsReservations";
import {Events} from "ionic-angular";
import * as moment from 'moment'
import {ConfigProvider} from "../../providers/config/config";
import {ITimeslot} from "../../interfaces/IAppConfig";

/**
 * Generated class for the RoomsBookedComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rooms-booked',
  templateUrl: 'rooms-booked.html'
})
export class RoomsBookedComponent implements OnInit {

  moment=moment;
  timeslots = ConfigProvider.config.general.timeslots;

  when:string = "now";

  bookedRooms = {
    now: [],
    soon: []
  };

  constructor(private events: Events) {
  }

  whenChanged(event) {
    this.events.publish("userInput:clickedButton", {name:event})
  }

  // TODO: put this in webservice definition
  filterByTimeslot(reservations:IRoomReservation[], timeslot:ITimeslot){
    if (!Array.isArray(reservations)) {
      reservations = [reservations]
    }
    return reservations.filter(
      (r:IRoomReservation) => {
        let d = moment(r.startTime) >= moment(timeslot.begin) &&
                moment(timeslot.begin) >= moment(r.startTime);
        return d;
      }
    )
  }

  ngOnInit(): void {
    this.events.subscribe(`webservice:rooms-booked:now`,
      (response:IRoomReservation[]) => {
        this.bookedRooms.now = this.filterByTimeslot(response, this.timeslots.now);
      }
    );
    this.events.subscribe(`webservice:rooms-booked:soon`,
      (response:IRoomReservation[]) => {
        this.bookedRooms.soon = this.filterByTimeslot(response, this.timeslots.soon);
      }
    );
    this.events.subscribe("reset", ()=>{this.when="now"});

  }

  shortRoomCode (name){
    if(name){
      let name_without_latin_numbers = name.replace(/ I+$/, "");
      let latin_numbers_suffix = name.match(/ I+$/) || "";
      return (" " + name_without_latin_numbers).match(/ [a-zA-Z]/g).join('').replace(/ /g, '') + latin_numbers_suffix;
    } else {
      return ""
    }
  }

  shortPersonName (personName){
    if(personName){
      let short_person_name = personName.replace(/(Dr. |Prof.)/g, '');
      short_person_name = short_person_name.match(/[A-Z]/g).join('.') + '.';

      if (!short_person_name){
        short_person_name = 'N.N';
      }
      return short_person_name;
    } else {
      return ""
    }
  }

}
