define('News', ['jquery', "json!../../config.json", "newsApi", 'moment'], function($, config, newsApi, moment) {

    var News = function(domElement, options) {
        var that = this;
        this.domElement = $(domElement);
        this.newsTableBody = this.domElement.find('.js_news_tbody');
        this.newsTable = this.domElement.find('.js_news');
        this.refresh();
        setInterval(function() {
            that.refresh();
        }, config.news_update_frequency * 1000);
    };

    News.prototype.refresh = function() {
        var that = this;

        newsApi.getLatestNews(function(error, newsItems) {
           if (error) {
               return ;
           }

            if (newsItems.length == 0) {
                return ;
            }

            newsItems.sort(function(a, b) {
                if (a.getPublishedTimestamp().getTime() == b.getPublishedTimestamp().getTime()) {
                    return 0;
                }
                return a.getPublishedTimestamp().getTime() < b.getPublishedTimestamp().getTime() ? 1 : -1;
            });

            that.newsTableBody.empty();
            that.newsTable.css('height', 'calc(90% -  ' + ($('.free-rooms').outerHeight() + 38) + 'px)');
            that.newsTable.css('margin-bottom', '0');

            newsItems = newsItems.splice(0, config.news_per_page);

            newsItems.forEach(function(newsItem) {
                var tr = $('<tr><td class="news-td" colspan="2"><div class="news-title">Das ist der Titel</div></td></tr>');
                tr.find('td').css('background-image', 'url(\'' + newsItem.getImageSrc() + '\')');
                tr.find('.news-title').text(newsItem.getTitle() + ' (' + moment(newsItem.getPublishedTimestamp()).format('DD.MM.YYYY') + ')');
                that.newsTableBody.append(tr);
            });
        });
    };

    return News;
});