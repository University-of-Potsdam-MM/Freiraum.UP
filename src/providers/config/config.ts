import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppConfig } from "../../interfaces/IAppConfig";
import {Observable, Subject} from "rxjs";
import * as moment from "moment";

export interface IProgress {
  progress:number;
  nextSlide:boolean;
}

/**
 * @classdesc Provides easy access to config
 */
@Injectable()
export class ConfigProvider {

  static config:IAppConfig;

  static timer;
  static progress:Subject<IProgress> = new Subject<IProgress>();
  static configReady:Subject<IAppConfig>;

  static currentPage;

  constructor(private http: HttpClient) {
    ConfigProvider.configReady = new Subject<any>()
  }

  /**
   * @desc loads config file. See https://blogs.msdn.microsoft.com/premier_developer/2018/03/01/angular-how-to-editable-config-files/
   * Must be called in app.module.ts
   */
  load(uri:string='assets/config.json') {
    return new Promise<void>((resolve, reject) => {
      this.http.get(uri).toPromise().then(
        (response:IAppConfig) => {
          // assign response
          ConfigProvider.config = response;

          // start config related tasks
          this.init();

          // signal, that the config has been loaded to the outside. This is
          // relevant to some other providers.
          ConfigProvider.configReady.next(ConfigProvider.config);
          ConfigProvider.configReady.complete();

          // resolve promise to finish initialization
          resolve();
        }
      ).catch(
        (response: any) => {
          ConfigProvider.configReady.error(`Could not load file '${uri}': ${JSON.stringify(response)}`)
          reject(`Could not load file '${uri}': ${JSON.stringify(response)}`);
      });
    });
  }

  init(){
    this.updateTimeSlots();
    this.startProgressTimer();
  }

  /**
   * @desc starts the progress timer which is consumed by header-component
   */
  public startProgressTimer(){
    ConfigProvider.timer = Observable.timer(0, 1000).subscribe(
      n => {
        if(n>0){
          this.updateProgress(n % ConfigProvider.config.general.page_switching_frequency);
        }
      }
    );
  }

  /**
   * @desc stops the progress timer which is consumed by header-component
   */
  public stopProgressTimer(){
    this.setProgressToZero();
    ConfigProvider.timer.unsubscribe();
  }

  /**
   * @desc updates timeslots in config when called, but only in specified frequency
   */
  private updateTimeSlots() {
    Observable.timer(0, ConfigProvider.config.general.timeslot_update_frequency*1000).subscribe(
      n => {
        let timeSlotDuration = moment.duration(2, "hours");

        let nowBegin = moment()
          .set("hours", Math.floor(moment().get("hours") / 2) * 2)
          .set("minutes", 0)
          .set("seconds", 0)
          .set("milliseconds", 0);

        let soon = nowBegin.clone().add(timeSlotDuration);
        let soonEnd = soon.clone().add(timeSlotDuration);

        ConfigProvider.config.general.timeslots.now.begin = nowBegin.toISOString(false);
        ConfigProvider.config.general.timeslots.now.end = soon.toISOString(false);

        ConfigProvider.config.general.timeslots.soon.begin = soon.toISOString(false);
        ConfigProvider.config.general.timeslots.soon.end = soonEnd.toISOString(false);
      }
    )
  }

  /**
   *
   */
  private setProgressToZero(){
    ConfigProvider.progress.next({progress:0, nextSlide:false});
  }

  /**
   * @desc makes ConfigProvider.progress emit a new value based on time since start
   *
   * TODO: Should really make this timer not hit 32 bit somehow
   */
  private updateProgress(next){
    ConfigProvider.progress.next({
      progress: (next / ConfigProvider.config.general.page_switching_frequency) * 100,
      nextSlide: next == 0
    });
  }

}
