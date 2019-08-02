import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {IAppConfig} from "../../interfaces/IAppConfig";
import {ConfigProvider} from "../config/config";
import * as moment from "moment";
import {Logger, LoggingService} from "ionic-logging-service";
import {IMensaResponse} from "../../interfaces/IMensa";
import {Events} from "ionic-angular";
import {IRoomsReservationsResponse} from "../../interfaces/IRoomsReservations";
import {IRooms4TimeResponse} from "../../interfaces/IRooms4time";
import {ITransportResponse} from "../../interfaces/ITransport";
import {IEventsResponse} from "../../interfaces/IEvents";

type Func = () => {[name:string]:string}

/**
 * @desc describes a set of parameters used for a single web service call
 */
interface IParamSet {
  /**
   * @desc name of this param set. Should be used when there are multiple paramSets.
   * If it is used the event published by Events will contain this name.
   */
  name?:string;
  /**
   * @desc params to be used for this paramSet. May either be a object containing
   * the parameters to be used or a function which returns such an object
   */
  params?:{[name:string]:string} | Func;
}

/**
 * gets the param described by params from object
 * @param p
 * @param o
 */
function get(params:string[], object:any) {
  return params.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, object)
}

/**
 */
interface IWSCall {
  name:string;
  targetProperty?:string[];
  namedTargetProperties?:{[name:string]:string[]};
  processResponse?:(response:any, targetProperty?:string[], namedTargetProperties?:{[name:string]:string[]})=>any;
  processError?:(error:any)=>any;
  paramSets?:IParamSet[];
}

/**
 * @classdesc Contains all used web-service calls
 */
@Injectable()
export class WebServiceProvider {

  millisecond = 1000;
  config:IAppConfig = ConfigProvider.config;
  logger:Logger;

  constructor(public http: HttpClient,
              private logging: LoggingService,
              private events: Events) {
    this.logger = logging.getLogger("FreiraumUP.WebServiceProvider");
  }

  defaultProcessingFunctions = {
    // just return the response or, if targetProperty is defined, try to get the
    // targetProperty and if it does not exist return an empty array
    // If multipleTargetProperties is specified, those will be tested
    processResponse: (response:any,
                      targetProperty?:string[],
                      namedTargetProperties?:{[name:string]:string[]}) => {
      if(targetProperty) {
        try {
          return get(targetProperty, response) || [];
        } catch(e) {
          return [];
        }
      } else if(namedTargetProperties){
        let result = {};
        for(let propName in namedTargetProperties) {
          try {
            result[propName] = get(namedTargetProperties[propName], response) || [];
          } catch(e) {
            result[propName] = [];
          }
        }
        return result;
      } else {
        return response
      }
    },
    // just return an empty array as response
    processError: (error:any) => { return [] }
  };

  buildRoomRequest(when) {
    return {
      format: "json",
      campus: this.config.general.location.campus.toString(),
      building: this.config.general.location.building.toString(),
      startTime: this.config.general.timeslots[when].begin,
      endTime: this.config.general.timeslots[when].end
    }
  }

  /**
   * @desc Specifies the web service calls that should be executed on a regular
   * basis.
   */
  wsCalls:IWSCall[] = [
    {
      name: "news",
      processResponse: (response) => {
        let results = this.defaultProcessingFunctions.processResponse(
          response, null,
          {
            news: ["vars", "news"],
            newsSources: ["vars", "newsSources"]
          }
        );

        let r = {};

        for(let key in results.newsSources) {
          r[results.newsSources[key]] = [];
        }
        for(let news of results.news) {
          r[news.NewsSource.name].push(
            {News: news.News, NewsSource: news.NewsSource}
          );
        }

        return r;
      }
    },
    {
      name: "events",
      targetProperty: ["vars", "events"]
    },
    {
      name:"mensa",
      paramSets: [
        {name:"NeuesPalais", params:{location: "NeuesPalais"}},
        {name:"UlfsCafe", params:{location: "UlfsCafe"}},
        {name:"Golm", params:{location: "Golm"}},
        {name:"Griebnitzsee", params:{location: "Griebnitzsee"}}
      ]
    },
    {
      name: "maps",
    },
    {
      name: "transport",
      paramSets: [{
        params: () => {
          return {
              maxJourneys: this.config.transport.count.toString(),
              format: "json",
              id: this.config.transport.station_id,
              time: moment().format('HH:mm:ss')
            }
          }
        }
      ],
      targetProperty: ["Departure"]
    },
    {
      name: "rooms-free",
      paramSets: [
        {
          name: "now",
          params: () => {
            return this.buildRoomRequest("now")
          }
        },
        {
          name: "soon",
          params: () => {
            return this.buildRoomRequest("soon")
          }

        }
      ],
      targetProperty: ["rooms4TimeResponse", "return"]
    },
    {
      name: "rooms-booked",
      paramSets: [
        {
          name: "now",
          params: () => {
            return this.buildRoomRequest("now")
          }
        },
        {
          name: "soon",
          params: () => {
            return this.buildRoomRequest("soon")
          }
        }
      ],
      targetProperty: ["reservationsResponse", "return"]
    }
  ];

  /**
   * @desc initiializes the defined HTTP calls. The calls will be executed in a
   * schedule. Each response will be processed by a dedicated function and the
   * result will be made available by the Events provider. If no processing
   * functions are given in the call definition the default function will be used.
   */
  public initializeCalls(){
    for(let call of this.wsCalls) {

      // use default functions if none are given
      if(!call.processResponse) {
        call.processResponse = this.defaultProcessingFunctions.processResponse
      }
      if(!call.processError) {
        call.processError = this.defaultProcessingFunctions.processError
      }
      if(!call.paramSets) {
        call.paramSets = [{params:{}}]
      }

      for(let paramSet of call.paramSets){
        let frequency = this.config.api.endpoints[call.name].frequency == undefined ?
                          this.config.api.default_frequency*this.millisecond :
                          this.config.api.endpoints[call.name].frequency*this.millisecond;

        Observable.timer(0, frequency).subscribe(
          next => {
            let eventName = `webservice:${call.name}${paramSet.name?':'+paramSet.name:''}`;
            this.logger.entry(eventName);

            this.http.get(
              this.config.api.endpoints[call.name].url,
              {
                headers: {Authorization: this.config.api.authorization},
                params:  typeof paramSet.params == "function" ? paramSet.params() : paramSet.params
              }
            ).subscribe(
              response => {
                this.logger.info(`Processing response from ${eventName}`);
                this.events.publish(
                  eventName,
                  call.processResponse(response, call.targetProperty, call.namedTargetProperties)
                );
              },
              (error:any) => {
                this.logger.error(`Error in webservice call ${eventName}: ${JSON.stringify(error)}`);
                this.events.publish(
                  eventName,
                  call.processError(error)
                );
              }
            )
          }
        )
      }
    }
  }

  // forceCall(name, paramSet=""){
  //   let call = this.wsCalls.filter((call)=>{return call.name==name})[0];
  //   let callConfig = this.config.api.endpoints[call.name];
  //
  //
  //   this.http.get(
  //     callConfig.url,
  //     {
  //       headers:{Authorization: this.config.api.authorization},
  //       params: typeof call.params == "function" ? paramSet.params() : paramSet.params
  //     }
  //   )
  // }
}
