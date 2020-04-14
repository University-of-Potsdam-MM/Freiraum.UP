import {ConfigService} from '../../services/config/config.service';
import {Config} from '../../../types/Config';
import {ApiService} from '../../services/api/api.service';
import {Injector, Type} from '@angular/core';
import {StaticInjectorService} from './static-injector';
import * as moment from 'moment';
import {TimerService} from '../../services/timer/timer.service';

export abstract class BasicPageComponent {

  protected config: Config = ConfigService.config;
  protected api: ApiService;
  protected moment = moment;
  protected timerService: TimerService;

  constructor() {
      const injector: Injector = StaticInjectorService.getInjector();
      this.api = injector.get<ApiService>(ApiService as Type<ApiService>);
      this.timerService = injector.get<TimerService>(TimerService as Type<TimerService>);
  }

}
