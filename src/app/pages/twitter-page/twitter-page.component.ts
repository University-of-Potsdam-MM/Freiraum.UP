import {Component, Input, OnInit} from '@angular/core';
import * as twitterWidgets from 'twitter-widgets';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';

const input = Input('channel');

@Component({
  selector: 'app-twitter-page',
  templateUrl: './twitter-page.component.html',
  styleUrls: ['./twitter-page.component.scss'],
})
export class TwitterPageComponent extends BasicPageComponent implements OnInit {

  @input channel: string;

  constructor() { super('twitter'); }

  ngOnInit() {
    twitterWidgets.load();
  }

}
