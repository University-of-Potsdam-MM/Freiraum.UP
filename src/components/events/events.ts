import {Component, OnInit} from '@angular/core';
import {Events} from "ionic-angular";
import {IEvent, IEventsResponse} from "../../interfaces/IEvents";

/**
 * Generated class for the EventsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'events',
  templateUrl: 'events.html'
})
export class EventsComponent implements OnInit {

  eventsList: IEvent[];

  constructor(private events: Events) {}

  ngOnInit(){
    this.events.subscribe(
      "webservice:events",
      (events:IEvent[]) => {
        this.eventsList = events
      }
    )
  }
}
