import {ConfigService} from '../../services/config/config.service';
import {Config} from '../../../types/Config';
import {ApiService} from '../../services/api/api.service';
import {Injector, Type} from '@angular/core';
import {StaticInjectorService} from './static-injector';
import * as moment from 'moment';
import {TimerService} from '../../services/timer/timer.service';
import {PageSelectedService} from '../../services/page-selected/page-selected.service';

export abstract class BasicPageComponent {

  protected config: Config = ConfigService.config;
  protected api: ApiService;
  protected moment = moment;
  protected timerService: TimerService;

  private pages: PageSelectedService;
  private name: string;

  constructor(name: string = 'noName') {
    this.name = name;
    const injector: Injector = StaticInjectorService.getInjector();
    this.api = injector.get<ApiService>(ApiService as Type<ApiService>);
    this.timerService = injector.get<TimerService>(TimerService as Type<TimerService>);
    this.pages = injector.get<PageSelectedService>(PageSelectedService as Type<PageSelectedService>);
    this.pages.selected.subscribe(
      selected => {
        if (selected === name) { this.onSelected(); }}
    );
  }

  onSelected() {
    console.log(`'onSelected()' not implemented for component '${this.name}'.`);
  }
}
