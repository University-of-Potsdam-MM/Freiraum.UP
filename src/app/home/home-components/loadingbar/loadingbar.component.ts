import {Component, Input, OnInit} from '@angular/core';
import {TimerService} from '../../../services/timer/timer.service';

@Component({
  selector: 'app-loadingbar',
  templateUrl: './loadingbar.component.html',
  styleUrls: ['./loadingbar.component.scss'],
})
export class LoadingbarComponent implements OnInit {

  progress: number;

  constructor(private timer: TimerService) { }

  ngOnInit() {
    this.timer.progress.subscribe(p => { this.progress = p; });
  }

}
