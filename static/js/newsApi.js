define('newsApi', ['jquery', "json!../../config.json", "moment", "domain/NewsItem"], function($, config, moment, NewsItem) {

    var NewsApi = function() {
    };

    NewsApi.prototype.getLatestNews = function(callback) {
        var that = this;

        this.rawCall(function(error, responseXml) {
            if (error) {
                callback(error, responseXml);
            } else {
                callback(error, that.parseNewsResponse(responseXml));
            }
        });
    };

    //TransportApi.prototype.getTrainsForStation = function(stationId, callback) {
    //    var that = this;
    //    var xmlString = '<STBReq boardType="DEP" maxJourneys="20" sortOrder="REALTIME"><Time>' + moment().format('HH:mm:ss') + '</Time><Today/><TableStation externalId="' + stationId + '"/><ProductFilter>1111111111111111</ProductFilter></STBReq>';
    //    this.rawCall(xmlString, function(error, xmlResponseString) {
    //        if (error) {
    //            callback(error, xmlResponseString);
    //        } else {
    //            callback(error, that.parseJourneyListResponse(xmlResponseString));
    //        }
    //    });
    //};
    //
    NewsApi.prototype.parseNewsResponse = function(xmlString) {
        var newsItems = [];
        var xml = $(xmlString);


        xml.find('entry').each(function(position, newsNode) {
            newsNode = $(newsNode);
            var contentNode = newsNode.find('content');
            var imgNode = contentNode.find('img').first();

            if (!imgNode.attr('src')) {
                /* Ignore news entries without an image */
                return ;
            }
            imgNode.remove();
            /* Remove <p><a ...>see more of it</a></p> Link */
            contentNode.find('p').last().remove();
            newsItems.push(new NewsItem({
                "title":  newsNode.find('title').text().trim(),
                /* FIXME: Rewrite-HACK for #26 @ https://github.com/University-of-Potsdam-MM/rooms/issues/26 */
                "imageSrc":  (imgNode.attr('src') || "").replace(/uploads\//, "uploads01/"),
                "content": contentNode.text().trim(),
                "publishedTimestamp":  moment(newsNode.find('published').text()).toDate()
            }));
        });

        return newsItems;
    };

    NewsApi.prototype.rawCall = function(callback) {
        $.ajax({
            type: "GET",
            url: config.news_rss_feed_url,
            crossDomain: true,
            contentType: 'text/xml'
        }).then(function(responseXml) {
            callback(false, responseXml);
        }).fail(function(responseXml) {
            callback(true, 'Invalid response');
        });
    };

    return new NewsApi();
});