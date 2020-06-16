import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as twitterWidgets from 'twitter-widgets';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-twitter-page',
  templateUrl: './twitter-page.component.html',
  styleUrls: ['./twitter-page.component.scss'],
})
export class TwitterPageComponent extends BasicPageComponent implements AfterViewInit {

  feeds = this.config.twitter.feeds;
  selectedFeedIndex = 0;

  constructor() { super('twitter'); }

  ngAfterViewInit() {
      twitterWidgets.load();
  }

  onSelected() {
    this.selectedFeedIndex = this.selectedFeedIndex < this.feeds.length - 1
      ? this.selectedFeedIndex + 1
      : 0;
    this.customTitle = '@' + this.feeds[this.selectedFeedIndex].name;
  }

}
