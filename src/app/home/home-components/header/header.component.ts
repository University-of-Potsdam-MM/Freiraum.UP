import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TimerService} from '../../../services/timer/timer.service';
import {ConfigService} from '../../../services/config/config.service';
import {Config} from '../../../../types/Config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit {

  config: Config = ConfigService.config;

  constructor(private timer: TimerService) { }

  ngAfterViewInit() {

  }

}
