import {Component, Input, OnInit} from '@angular/core';
import {IAppConfig} from "../../interfaces/IAppConfig";
import {ConfigProvider} from "../../providers/config/config";
import {Events} from "ionic-angular";

/**
 * @classdesc Retrieves news regularly and displays recent news
 */
@Component({
  selector: 'news',
  templateUrl: 'news.html'
})
export class NewsComponent implements OnInit {

  /**
   * @desc sets the mode of this components instance
   */
  @Input() mode:string;

  newsList:INewsListItem[] = [];
  config:IAppConfig = ConfigProvider.config;

  categories=[]
  news:{[category:string]:INewsListItem[]};
  selectedCategory;

  constructor(private events: Events) {}

  selectCategory(category) {
    this.selectedCategory = category;
    this.events.publish(
      "userInput:clickedButton",
      {name: category}
    );
  }

  /**
   * @desc retrieves news from server by subscribing to NewsProviders
   * getNews function and then stores them in components newList
   */
  getNews(){
    this.events.subscribe("webservice:news",
      (response) => {
        // this.newsList = response.news;
        this.categories = Object.keys(response);
        this.news = response;
        this.selectedCategory = this.categories[0];
      }
    );
    this.events.subscribe("reset", ()=>{this.selectedCategory=this.categories[0]});

  }

  ngOnInit(){
    this.getNews();
  }

}
