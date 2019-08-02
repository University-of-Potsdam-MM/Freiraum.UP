import {Component, OnInit} from '@angular/core';
import {Events} from "ionic-angular";
import {ConfigProvider} from "../../providers/config/config";
import * as moment from "moment";

/**
 * Generated class for the RoomsFreeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'rooms-free',
  templateUrl: 'rooms-free.html'
})
export class RoomsFreeComponent implements OnInit {
  moment = moment;
  timeslots = ConfigProvider.config.general.timeslots;

  when:string = "now";

  freeRooms = {
    now: [],
    soon: []
  };

  constructor(private events: Events) {}

  whenChanged(event) {
    this.events.publish("userInput:clickedButton", {name:event})
  }

  /**
   * necessary, because API returns "room" instead of ["room"] in case there is
   * only one room
   * @param response
   */
  handleEdgeCase(response) {
    return typeof response == "string" ? [response] : response;
  }

  /**
   * @desc sets up retrieval of free rooms
   */
  ngOnInit(){
    this.events.subscribe("webservice:rooms-free:now",
      (response) => {
        this.freeRooms.now = this.handleEdgeCase(response);
      }
    );
    this.events.subscribe("webservice:rooms-free:soon",
      (response) => {
        this.freeRooms.soon = this.handleEdgeCase(response);
      }
    );
    this.events.subscribe("reset", ()=>{this.when="now"});
  }

}
