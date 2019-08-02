import {Component, OnInit} from '@angular/core';
import {IDeparture} from "../../interfaces/ITransport";
import {Events} from "ionic-angular";
import {Logger, LoggingService} from "ionic-logging-service";
import * as moment from "moment";
import {IAppConfig} from "../../interfaces/IAppConfig";
import {ConfigProvider} from "../../providers/config/config";

@Component({
  selector: 'transport',
  templateUrl: 'transport.html'
})
export class TransportComponent implements OnInit {
  config:IAppConfig = ConfigProvider.config;

  moment = moment;
  departures:IDeparture[] = [];
  logger:Logger;
  station = this.config.transport.station_name;

  constructor(private logging: LoggingService,
              private events: Events) {
    this.logger = this.logging.getLogger("FreiraumUP.Transport")
  }

  ngOnInit(){
    this.getJourneys()
  }

  /**
   * @desc returns currently available journeys
   */
  getJourneys(){
    this.events.subscribe("webservice:transport",
      (response:IDeparture[]) => {
        this.departures = response;
      }
    )
  }
}
