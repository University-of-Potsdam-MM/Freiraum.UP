import {ConfigService} from '../../services/config/config.service';
import {Config} from '../../../types/Config';
import {ApiService} from '../../services/api/api.service';
import {Injector, Type} from '@angular/core';
import {StaticInjectorService} from './static-injector';
import * as moment from 'moment';
import {TimerService} from '../../services/timer/timer.service';
import {PageSelectedService} from '../../services/page-selected/page-selected.service';
import {NGXLogger} from 'ngx-logger';
import {TranslateService} from '@ngx-translate/core';

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
  protected pages: PageSelectedService;
  /* provides access to the TranslateService */
  protected translate: TranslateService;

  protected logger: NGXLogger;

  /* holds the name of this page, set by constructor */
  private readonly name: string;

  customTitle = '';

  protected constructor(name: string = 'noName') {
    this.name = name;

    const injector: Injector = StaticInjectorService.getInjector();

    // creates instances of the services that should be provided to all components extending this class
    this.api = injector.get<ApiService>(ApiService as Type<ApiService>);
    this.timerService = injector.get<TimerService>(TimerService as Type<TimerService>);
    this.pages = injector.get<PageSelectedService>(PageSelectedService as Type<PageSelectedService>);
    this.translate = injector.get<TranslateService>(TranslateService as Type<TranslateService>);
    this.logger = injector.get<NGXLogger>(NGXLogger as Type<NGXLogger>);

    this.info(`Created '${name}'.`);

    // calls the onSelect method if this page has been selected. Whether is has been selected will be detected with
    // help of the 'name' attribute. That's why we want to pass a name to the constructor.
    if (!this.config.general.interactiveMode) {
      this.pages.selected.subscribe(
        selected => {
          if (selected === name) {
            this.onSelected();
            this.pages.title.next(this.customTitle);
          }}
      );
    }
  }

  // method stub for the method that is called once the page is selected
  onSelected() {
    this.info(`'onSelected()' not implemented.`);
  }

  onReset() {
    this.info(`'onReset()' not implemented.`);
  }

  protected info(message, ...additional)  { this.logger.info(`[${this.name}]: ${message}; ${additional}`); }
  protected debug(message, ...additional) { this.logger.debug(`[${this.name}]: ${message}; ${additional}`); }
  protected error(message, ...additional) { this.logger.error(`[${this.name}]: ${message}; ${additional}`); }
  protected fatal(message, ...additional) { this.logger.fatal(`[${this.name}]: ${message}; ${additional}`); }
  protected log(message, ...additional)   { this.logger.log(`[${this.name}]: ${message}; ${additional}`); }
}
