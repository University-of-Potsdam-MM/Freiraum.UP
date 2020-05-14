import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {EventItem} from '../../../types/events.response';
import {iterableArray} from '../../util/iterableArray';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.scss'],
})
export class EventsPageComponent extends BasicPageComponent implements OnInit {

  eventsForPlace: {[placeId: string]: {placeName: string, items: EventItem[]}} = {};
  placesList: string[];
  placesIterable: IterableIterator<string>;
  selectedPlaceId: string;
  eventsReady = false;

  constructor() { super('events'); }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.api.feeds.events.subscribe(
      r => {
        const startDate = this.moment().subtract(4, 'week');
        const endDate = this.moment().add(8, 'weeks');

        for (const eventPlaceId in r.vars.places) {
          const events = r.vars.events
            .filter(event => event.Event.place_id === eventPlaceId)
            .filter(event => this.moment.unix(parseInt(event.Event.startTime, 10)).isBetween(startDate, endDate));

          if (events.length > 0) {
            this.eventsForPlace[eventPlaceId] = {
              placeName: r.vars.places[eventPlaceId],
              items: events
            };
          }
        }
        this.placesList = Object.keys(this.eventsForPlace);
        this.placesIterable = iterableArray(this.placesList);
        this.selectedPlaceId = this.placesList[0];
        this.eventsReady = true;
      }
    );
  }

  onSelectedByInteraction(event) {
    this.selectedPlaceId = event;
    this.placesIterable = iterableArray(
      this.placesList,
      this.placesList.findIndex(i => i === event)
    );
  }

  onSelected() {
    this.selectedPlaceId = this.placesIterable.next().value;
  }
}
