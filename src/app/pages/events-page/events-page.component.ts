import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {EventItem, EventsResponse} from '../../../types/events.response';
import * as moment from 'moment';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss'],
})
export class EventsPageComponent extends BasicPageComponent implements OnInit {

  events: EventItem[] = [];
  places: {id: number, name: string}[] = [];
  selectedPlaceId;
  filteredEvents: EventItem[] = [];

  constructor() { super('events'); }

  /**
   * filters the currently available events by the selected place
   * @param selectedPlaceId: id of the selected place
   */
  filterEvents(selectedPlaceId: string) {
    this.filteredEvents = this.events.filter(n => {
      return n.Place.id === parseInt(selectedPlaceId, 10);
    });
  }

  ngOnInit(): void {
    this.api.feeds.events.subscribe(
      (response: EventsResponse) => {

        const temp = response;
        // replacing localized datestring with iso datestring
        temp.vars.events.forEach(
          e =>  e.Event.DateString = moment(e.Event.DateString, 'MMMM, DD.MM.YYYY, HH:mm', 'de').toISOString()
        );

        // filtering for recent events only and sorting by descending date
        this.events = temp.vars.events
          .filter(
            (event: EventItem) => moment(event.Event.DateString).isAfter(moment().subtract(2, 'year'))
          ).sort(
          (a, b) =>  moment(b.Event.DateString).unix() - moment(a.Event.DateString).unix()
          );

        // converting single places object to array of objects for convenience
        Object.keys(response.vars.places).forEach(
          key => {
            this.places.push(
              {
                id: parseInt(key, 10),
                name: response.vars.places[key]
              }
            );
          }
        );

        // select first place by default
        this.selectedPlaceId = this.places[0].id;
      }
    );
  }
}
