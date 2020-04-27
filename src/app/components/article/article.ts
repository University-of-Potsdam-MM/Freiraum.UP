import { Component, Input } from '@angular/core';
import {NewsItem} from '../../../types/news.response';
import {EventItem} from '../../../types/events.response';
import {ConfigService} from "../../services/config/config.service";

@Component({
  selector: 'article',
  templateUrl: 'article.html'
})
export class ArticleComponent {

  config = ConfigService.config;

  @Input() public articleType: 'news'|'event';
  @Input() public article: NewsItem | EventItem;

  constructor() {

    // hides images that could not be loaded (404)
    // maybe show an replacement image in the future?
    const list = document.getElementsByTagName('img');

    let i;
    for (i = 0; i < list.length; i++) {
      list[i].onerror = function() {
        this.style.display = 'none';
      };
    }
  }
}
