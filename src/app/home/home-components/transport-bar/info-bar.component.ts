import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../../components/basic-page/basic-page.component';
import {Departure} from '../../../../types/publicTransport.response';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss'],
})
export class InfoBarComponent extends BasicPageComponent implements OnInit {

  connections: {departure: Departure, minutesRemaining: number}[] = [];
  rooms: string[] = [];

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
          .slice(0, this.config.infobar.public_transport.count);
      }
    );

    this.api.feeds.rooms.now.subscribe(
      rooms => { this.rooms = rooms; }
    );
  }

}
