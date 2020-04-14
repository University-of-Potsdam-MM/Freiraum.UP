export interface NewsResponse {
    vars: Vars;
}

export interface Vars {
    news: NewsItem[];
    newsSources: {[id: string]: string};
}

export interface NewsItem {
  News: News;
  NewsSource: NewsSource;
}

export interface News {
    link: string;
    headline: string;
    description: string;
    text: string;
    source_id: string;
    DateString: string;
    time: string;
    id: string;
}

export interface NewsSource {
  url: string;
  name: string;
  id: number;
  rank: number;
}
