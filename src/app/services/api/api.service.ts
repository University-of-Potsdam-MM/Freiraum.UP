import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Observable, Subject, timer} from 'rxjs';
import * as moment from 'moment';

import {Meal, MensaResponse} from '../../../types/mensa.response';
import {PublicTransportResponse} from '../../../types/publicTransport.response';
import {EventsResponse} from '../../../types/events.response';
import {NewsItem, NewsResponse} from '../../../types/news.response';
import {FreeRoomsResponse} from '../../../types/freeRooms.response';
import {IRoomReservation, ReservedRoomsResponse} from '../../../types/reservedRooms.response';
import {CampusMapDataResponse} from '../../../types/campusMapData.response';
import {TimerService} from '../timer/timer.service';
import {Timeslot} from '../../../types/Config';
import {NGXLogger} from "ngx-logger";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('assets')) {
      req = req.clone(
        { setHeaders: { Authorization: ConfigService.config.api.authorization } }
      );
    }
    return next.handle(req);
  }
}

function buildRoomRequest(timeslot) {
  return {
    format: 'json',
    campus: ConfigService.config.general.location.campus.toString(),
    building: ConfigService.config.general.location.building.toString(),
    startTime: timeslot.begin,
    endTime: timeslot.end
  };
}

function filterByTimeslot(reservations: IRoomReservation[], timeslot: Timeslot) {
  if (!Array.isArray(reservations)) {
    reservations = [reservations];
  }
  return reservations.filter(
    (r: IRoomReservation) => {
      const d = moment(r.startTime) >= moment(timeslot.begin) &&
              moment(timeslot.begin) >= moment(r.startTime);
      return d;
    }
  );
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private config = ConfigService.config;

  private timer;

  today = moment();

  public feeds = {
    mensa: {
      NeuesPalais: new Subject<Meal[]>(),
      Golm: new Subject<Meal[]>(),
      Griebnitzsee: new Subject<Meal[]>(),
      UlfsCafe: new Subject<Meal[]>()
    },
    publicTransport: new Subject<PublicTransportResponse>(),
    events: new Subject<EventsResponse>(),
    news: new Subject<NewsResponse>(),
    rooms: {
      now: new Subject<string[]>(),
      soon: new Subject<string[]>()
    },
    lectures: {
      now: new Subject<IRoomReservation[]>(),
      soon: new Subject<IRoomReservation[]>()
    },
    campusMapData: new Subject<CampusMapDataResponse>()
  };

  feedFunctions: {[feedName: string]: () => void} = {
    mensa: () => {
      for (const canteen of this.config.mensa.canteens) {
        this.http.get(
          this.config.api.endpoints.mensa.url,
          {params: {location: canteen.name}}
        ).subscribe(
          (response: MensaResponse) => {
            response.meal = response.meal.filter(
              meal => this.today.isSame(meal.date, 'date')
            );
            this.feeds.mensa[canteen.name].next(response);
          }
        );
      }
    },
    transport: () => {
      this.http.get(
        this.config.api.endpoints.transport.url,
        {
          params: {
            maxJourneys: this.config.transport.count.toString(),
            format: 'json',
            id: this.config.transport.station_id,
            time: moment().format('HH:mm:ss')
          }
        }
      ).subscribe(
        (response: PublicTransportResponse) => {
          this.feeds.publicTransport.next(response);
        }
      );
    },
    events: () => {
      this.http.get(
        this.config.api.endpoints.events.url
      ).subscribe(
        (response: EventsResponse) => {
          this.feeds.events.next(response);
        }
      );
    },
    news: () => {
      this.http.get(
        this.config.api.endpoints.news.url
      ).subscribe(
        (response: NewsResponse) => {
          this.feeds.news.next(response);
        }
      );
    },
    maps: () => {
      this.http.get(
        this.config.api.endpoints.maps.url
      ).subscribe(
        (response: CampusMapDataResponse) => {
          this.feeds.campusMapData.next(response);
        }
      );
    },
    rooms: () => {
      for (const slot of ['now', 'soon']) {
        this.http.get(
        this.config.api.endpoints.rooms.url,
          {
            params: buildRoomRequest(this.timerService.timeslots[slot])
          }).subscribe(
          (response: FreeRoomsResponse) => {
            try {
              this.feeds.rooms[slot].next(
                response.rooms4TimeResponse.return
              );
            } catch (e) {
              this.logger.log(`No rooms for timeslot '${slot}'`);
              this.feeds.rooms[slot].next([]);
            }
          }
        );
      }
    },
    lectures: () => {
      for (const slot of this.config.lectures.timeslots) {
        this.http.get(
          this.config.api.endpoints.lectures.url,
          {
            params: buildRoomRequest(this.timerService.timeslots[slot])
          }).subscribe(
          (response: ReservedRoomsResponse) => {
            try {
              this.feeds.lectures[slot].next(
                filterByTimeslot(
                  response.reservationsResponse.return,
                  this.timerService.timeslots[slot]
                )
              );
            } catch (e) {
              this.logger.log(`No lectures for timeslot '${slot}'`);
              this.feeds.lectures[slot].next([]);
            }
          }
        );
      }
    }
  };

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private timerService: TimerService) {}

  init() {
    for (const endpointName in this.config.api.endpoints) {
      const endpoint = this.config.api.endpoints[endpointName];
      const frequency = endpoint.frequency !== undefined ? endpoint.frequency : this.config.api.default_frequency;
      timer(0, frequency * 1000).subscribe(
        n => {
          try {
            this.feedFunctions[endpointName]();
          } catch (error) {
            this.logger.error(`Could not call feed function for ednpoint '${endpointName}'`);
          }
        }
      );
    }
  }

}
