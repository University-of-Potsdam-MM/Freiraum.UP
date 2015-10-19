define('collections/news', ["models/NewsCollection", "config"], function (NewsCollection, config) {
    "use strict";

    var news = new NewsCollection();
    news.fetch();

    setInterval(function() {
        news.fetch();
    }, config.get('news_update_frequency') * 1000);

    return news;
});