import { Component, OnInit } from '@angular/core';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {NewsItem, NewsResponse} from '../../../types/news.response';
import {iterableArray} from '../../util/iterableArray';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss'],
})
export class NewsPageComponent extends BasicPageComponent implements OnInit {

  newsForNewsSource: {[newsSourceId: string]: {newsSourceName: string, items: NewsItem[]}} = {};
  newsSourceNameMapping = {};
  newsSourcesList: string[] = [];
  newsSourcesIterable: IterableIterator<string>;
  selectedNewsSourceId: string;
  newsReady = false;

  constructor() { super('news'); }

  ngOnInit() {
    this.getNews();
  }

  getNews() {
    this.api.feeds.news.subscribe(
      (r: NewsResponse) => {
        const startDate = this.moment().subtract(4, 'week');
        const endDate = this.moment().add(4, 'weeks');
        // tslint:disable-next-line:forin
        for (const newsSourceId in r.vars.newsSources) {
          // get news for this newsSource
          const news = r.vars.news
            .filter(item => item.NewsSource.id === parseInt(newsSourceId, 10))
            .filter(item => this.moment.unix(parseInt(item.News.time, 10)).isBetween(startDate, endDate));
          const newsSourceName = r.vars.newsSources[newsSourceId];
          // only add this newsSource if there actually are news for it
          if (news.length > 0) {
            const toBeCombined = this.config.news.combine.find(v => v.categories.includes(newsSourceName));
            if (toBeCombined) {
              if (this.newsForNewsSource[toBeCombined.newId]) {
                this.newsForNewsSource[toBeCombined.newId].items.push(...news);
              } else {
                this.newsForNewsSource[toBeCombined.newId] = {
                  newsSourceName: toBeCombined.name,
                  items: news
                };
              }
            } else {
              this.newsForNewsSource[newsSourceId] = {
                newsSourceName,
                items: news
              };
            }
          }
        }

        this.newsSourcesList = Object.keys(this.newsForNewsSource);
        this.newsSourcesIterable = iterableArray(this.newsSourcesList);
        this.selectedNewsSourceId = this.newsSourcesList[0];
        this.newsReady = true;
      }
    );
  }

  onSelectedByInteraction(event) {
    this.selectedNewsSourceId = event;
    this.newsSourcesIterable = iterableArray(
      this.newsSourcesList,
      this.newsSourcesList.findIndex(i => i === event)
    );
  }

  onSelected() {
    if (this.newsReady) {
      this.selectedNewsSourceId = this.newsSourcesIterable.next().value;
    }
  }
}
