interface INewsResponse {
  passedArgs: any[];
  vars: IVars;
  errors: IErrors;
  message?: any;
  url: string;
  action: string;
  controller: string;
  model: string;
  base: string;
  webroot: string;
  browser: IBrowser;
  here: string;
  hereRel: string;
  routeUrl: string;
}

interface IVars {
  authUser?: any;
  flashMessage?: any;
  errors: IErrors;
  requestUrl: string;
  model: string;
  action: string;
  domain: string;
  webroot: string;
  request: IRequest;
  news: INewsListItem[];
  newsSources: {[newsId:string]:string};
  requestMethod: string;
  browser: IBrowser;
  isAjax: boolean;
  loggedIn: boolean;
}

interface IBrowser {
  name: string;
}

interface INewsListItem {
  News: INews;
  NewsSource: INewsSource;
}

interface INewsSource {
  id: string;
  mapping: string;
  name: string;
  url: string;
  sourceType: string;
  rank: string;
}

interface INews {
  id: string;
  headline: string;
  description: string;
  text: string;
  link: string;
  source_id: string;
  time: string;
  DateString: string;
}

interface IRequest {
  date: string;
}

interface IErrors {
  exist: boolean;
  inValidation: any[];
}
