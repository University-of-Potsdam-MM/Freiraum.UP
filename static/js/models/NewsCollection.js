define('models/NewsCollection', ["Backbone", "jquery", "config", "moment", "models/Event"], function (Backbone, $, config, moment, Event) {
    "use strict";

    var NewsCollection = Backbone.Collection.extend({
        model: Event,

        initialize: function(models, attributes) {
            if (!config.get('news_rss_feed_url')) throw new Error('Missing config.news_rss_feed_url attribute for NewsCollection');
        },

        comparator: function(a, b) {
            if (a.getPublishedTimestamp().getTime() == b.getPublishedTimestamp().getTime()) {
                return 0;
            }
            return a.getPublishedTimestamp().getTime() < b.getPublishedTimestamp().getTime() ? 1 : -1;
        },

        fetch: function(options) {
            options = options || {};
            var that = this;

            this.rawCall(config.get('news_rss_feed_url'), function(error, xmlResponseString) {
                if (error) {
                    if (options.error) {
                        options.error();
                    }
                } else {
                    var rawNews = that.parseNewsResponse(xmlResponseString);

                    that.reset(rawNews);
                    that.trigger('update');

                    if (options.success) {
                        options.success();
                    }
                }
            });
        },

        parseNewsResponse: function(xmlString) {
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

                newsItems.push({
                    "title":  newsNode.find('title').text().trim(),
                    /* FIXME: Rewrite-HACK for #26 @ https://github.com/University-of-Potsdam-MM/rooms/issues/26 */
                    "imageSrc":  (imgNode.attr('src') || "").replace(/uploads\//, "uploads01/"),
                    "content": contentNode.text().trim(),
                    "publishedTimestamp":  moment(newsNode.find('published').text()).toDate(),
                    "updatedTimestamp":  moment(newsNode.find('updated').text()).toDate()
                });
            });

            return newsItems;
        },

        rawCall: function(url, callback) {
            $.ajax({
                type: "GET",
                url: url,
                crossDomain: true,
                contentType: 'text/xml'
            }).then(function(responseXml) {
                callback(false, responseXml);
            }).fail(function(responseXml) {
                callback(true, 'Invalid response');
            });
        }
    });

    return NewsCollection;
});