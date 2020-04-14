import { Component, OnInit } from '@angular/core';
import {ConfigService} from '../../services/config/config.service';
import {BasicPageComponent} from '../../components/basic-page/basic-page.component';
import {NewsItem, NewsResponse, NewsSource} from '../../../types/news.response';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss'],
})
export class NewsPageComponent extends BasicPageComponent implements OnInit {

  news: NewsItem[] = [];
  filteredNews: NewsItem[] = [];
  newsSources: {id: number, name: string}[] = [];
  selectedNewsSourceId: number;

  constructor() { super(); }

  /**
   * filters the currently available news by the selected newsSource
   * @param selectedNewsSourceId: id of the selected newsSource
   */
  filterNews(selectedNewsSourceId: string) {
    this.filteredNews = this.news.filter(n => {
      return n.NewsSource.id === parseInt(selectedNewsSourceId, 10);
    });
  }

  ngOnInit() {
    this.api.feeds.news.subscribe(
      (response: NewsResponse) => {
        this.news = response.vars.news;

        // converting single newsSources object to array of objects for convenience
        Object.keys(response.vars.newsSources).forEach(
          key => {
            this.newsSources.push(
              {
                id: parseInt(key, 10),
                name: response.vars.newsSources[key]
              }
            );
          }
        );

        // select first newsSource by default
        this.selectedNewsSourceId = this.newsSources[0].id;
      }
    );
  }
}
