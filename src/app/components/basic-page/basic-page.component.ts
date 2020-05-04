import {ConfigService} from '../../services/config/config.service';
import {Config} from '../../../types/Config';
import {ApiService} from '../../services/api/api.service';
import {Injector, Type} from '@angular/core';
import {StaticInjectorService} from './static-injector';
import * as moment from 'moment';
import {TimerService} from '../../services/timer/timer.service';
import {PageSelectedService} from '../../services/page-selected/page-selected.service';

/**
 * This abstract page provides some features that all pages use
 */
export abstract class BasicPageComponent {

  /* provides access to the config */
  protected config: Config = ConfigService.config;
  /* provides access to the api service */
  protected api: ApiService;
  /* provides access to momentjs */
  protected moment = moment;
  /* provides access to the TimerService */
  protected timerService: TimerService;
  /* provides access to the PageSelectedService */
  private pages: PageSelectedService;

  /* holds the name of this page, set by constructor */
  private name: string;

  constructor(name: string = 'noName') {
    this.name = name;

    const injector: Injector = StaticInjectorService.getInjector();

    // creates instances of the services that should be provided to all components extending this class
    this.api = injector.get<ApiService>(ApiService as Type<ApiService>);
    this.timerService = injector.get<TimerService>(TimerService as Type<TimerService>);
    this.pages = injector.get<PageSelectedService>(PageSelectedService as Type<PageSelectedService>);

    // calls the onSelect method if this page has been selected. Whether is has been selected will be detected with
    // help of the 'name' attribute. That's why we want to pass a name to the constructor.
    this.pages.selected.subscribe(
      selected => {
        if (selected === name) { this.onSelected(); }}
    );
  }

  // method stub for the method that is called once the page is selected
  onSelected() {
    console.log(`'onSelected()' not implemented for component '${this.name}'.`);
  }

  onReset() {
    console.log(`'onReset()' not implemented for component '${this.name}'.`);
  }
}
