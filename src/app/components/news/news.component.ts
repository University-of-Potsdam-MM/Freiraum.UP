import { Component, Input } from '@angular/core';
import {NewsItem} from '../../../types/news.response';
import {ConfigService} from '../../services/config/config.service';

@Component({
  selector: 'news',
  templateUrl: 'news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent {

  config = ConfigService.config;

  @Input() public news: NewsItem;

  constructor() {
    // hides images that could not be loaded (404)
    // maybe show an replacement image in the future?
    const list = document.getElementsByTagName('img');

    for (let i = 0; i < list.length; i++) {
      list[i].onerror = function() {
        this.style.display = 'none';
      };
    }
  }
}
