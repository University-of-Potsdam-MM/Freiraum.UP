define('Events', ['jquery', "json!../../config.json", "newsApi", 'moment'], function($, config, newsApi, moment) {

    var Events = function(domElement, options) {
        var that = this;
        this.domElement = $(domElement);
        this.newsTableBody = this.domElement.find('.js_news_tbody');
        this.newsTable = this.domElement.find('.js_news');
        this.refresh();
        setInterval(function() {
            that.refresh();
        }, 10000);
    };

    Events.prototype.refresh = function() {
        var that = this;

        newsApi.getLatestEvents(function(error, newsItems) {
           if (error) {
               return ;
           }

            if (newsItems.length == 0) {
                return ;
            }

            newsItems.sort(function(a, b) {
                if (a.getUpdatedTimestamp().getTime() == b.getUpdatedTimestamp().getTime()) {
                    return 0;
                }
                return a.getUpdatedTimestamp().getTime() < b.getUpdatedTimestamp().getTime() ? -1 : 1;
            });

            var notYetStartedNews = [];

            newsItems.forEach(function(newsItem) {
                if (moment(newsItem.getUpdatedTimestamp()).toDate().getTime() > moment().toDate().getTime()) {
                    notYetStartedNews.push(newsItem);
                }
            });

            that.newsTableBody.empty();
            that.newsTable.css('height', 'calc(100% - ' + ($('.free-rooms').outerHeight() + 38) + 'px)');
            that.newsTable.css('margin-bottom', '0');

            notYetStartedNews = notYetStartedNews.splice(0, config.news_per_page);

            notYetStartedNews.forEach(function(newsItem) {
                console.log('newsItem', arguments[1], newsItem);
                var tr = $('<tr><td class="news-td" colspan="2"><div class="news-title">Das ist der Titel</div></td></tr>');
                tr.find('td').css('background-image', 'url(\'' + newsItem.getImageSrc() + '\')');
                tr.find('.news-title').text(newsItem.getTitle() + ' (' + moment(newsItem.getUpdatedTimestamp()).format('DD.MM.YYYY HH:mm') + ')');
                that.newsTableBody.append(tr);
            });
        });
    };

    return Events;
});