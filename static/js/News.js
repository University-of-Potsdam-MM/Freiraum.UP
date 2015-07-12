define('News', ['jquery', "json!../../config.json", "newsApi", 'moment'], function($, config, newsApi, moment) {

    var News = function(domElement, options) {
        var that = this;
        this.domElement = $(domElement);
        //this.journeysHeadline = this.domElement.find('.js_journeys_headline');
        this.newsTableBody = this.domElement.find('.js_news_tbody');
        this.newsTable = this.domElement.find('.js_news');
        this.refresh();
        setInterval(function() {
            that.refresh();
        }, 10000);
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

            //return ;

            that.newsTableBody.empty();
            that.newsTable.css('height', 'calc(100% - ' + ($('.free-rooms').outerHeight() + 38) + 'px)');
            that.newsTable.css('margin-bottom', '0');

            newsItems = newsItems.splice(0, config.news_per_page);

            newsItems.forEach(function(newsItem) {
                console.log('newsItem', arguments[1], newsItem);
                var tr = $('<tr><td class="news-td" colspan="2"><div class="news-title">Das ist der Titel</div></td></tr>');
                tr.find('td').css('background-image', 'url(\'' + newsItem.getImageSrc() + '\')');
                tr.find('.news-title').text(newsItem.getTitle() + ' (' + moment(newsItem.getPublishedTimestamp()).format('DD.MM.YYYY') + ')');
                that.newsTableBody.append(tr);
            });
        });

        //transportApi.getTrainsForStation(config.station_id, function(error, journeys) {
        //    if (error) {
        //        that.journeysHeadline.text('Fehler: Nahverkehrsverbindungen können nicht ermittelt werden.');
        //        return ;
        //    }
        //
        //    if (journeys.length == 0) {
        //        that.journeysHeadline.text('Aktuell keine Zug- und Busverbindungen.');
        //        return ;
        //    }
        //
        //    //that.journeysHeadline.text('Von: ' + journeys[0].getStationName());
        //    that.journeysHeadline.text('Nahverkehr');
        //    that.journeysTableBody.empty();
        //    journeys.forEach(function(journey) {
        //        var tr = $('<tr><td><strong class="js_journey_name"></strong></td><td><div><strong class="js_journey_direction"></strong></div><div class="js_journey_platform"></div></td><td class="text-right"><div><strong class="js_journey_time_absolute"></strong></div><div class="js_journey_time_relative"></div></td></tr>');
        //        tr.find('.js_journey_name').text(journey.getName());
        //        tr.find('.js_journey_direction').text(journey.getDirection());
        //        tr.find('.js_journey_time_absolute').text(journey.getTimeFormatted());
        //        tr.find('.js_journey_time_relative').text(journey.getTimeTo());
        //        if (journey.getPlatform()) {
        //            tr.find('.js_journey_platform').text('Gleis ' + journey.getPlatform());
        //        } else {
        //            tr.find('.js_journey_platform').text(journey.getPlatform());
        //        }
        //
        //
        //        that.journeysTableBody.append(tr);
        //    });
        //
        //});

    };

    return News;
});