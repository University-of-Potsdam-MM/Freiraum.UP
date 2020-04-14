import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {Departure, PublicTransportResponse} from '../../../types/publicTransport.response';
import * as moment from 'moment';

@Component({
  selector: 'app-public-transport-page',
  templateUrl: './public-transport-page.component.html',
  styleUrls: ['./public-transport-page.component.scss'],
})
export class PublicTransportPageComponent extends BasicPageComponent implements OnInit {

  moment = moment;
  station = this.config.transport.station_name;
  departures: Departure[] = [];

  constructor() { super(); }

  ngOnInit() {
    this.api.feeds.publicTransport.subscribe(
      (response: PublicTransportResponse) => {
        this.departures = response.Departure;
      }
    );
  }

}
