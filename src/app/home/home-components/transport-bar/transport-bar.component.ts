import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../../components/basic-page/basic-page.component';
import {Departure} from '../../../../types/publicTransport.response';

@Component({
  selector: 'app-transport-bar',
  templateUrl: './transport-bar.component.html',
  styleUrls: ['./transport-bar.component.scss'],
})
export class TransportBarComponent extends BasicPageComponent implements OnInit {

  connections: {departure: Departure, minutesRemaining: number}[];

  constructor() { super('transport-bar'); }

  ngOnInit() {
    this.api.feeds.publicTransport.subscribe(
      response => {
        this.connections = response.Departure
          // map departures to new object containing the remaining time
          .map(dep => {
            return {
              departure: dep,
              minutesRemaining: this.moment(dep.time, 'HH:mm:ss')
                                    .diff(this.moment(), 'minutes')
            }; })
          // filter out connections that have already departed or are departing right now
          .filter(conn => conn.minutesRemaining > 0)
          // show just as much as desired
          .slice(0, this.config.transportBar.count);
      }
    );
  }

}
