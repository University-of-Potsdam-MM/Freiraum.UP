define('models/BaseRssCollection', ["Backbone", "jquery", "config", "moment", "models/RssItem"], function (Backbone, $, config, moment, RssItem) {
    "use strict";

    var BaseRssCollection = Backbone.Collection.extend({
        model: RssItem,

        fetch: function(options) {
            options = options || {};
            var that = this;

            this.rawCall(this.getFeedUrl(), function(error, xmlResponseString) {
                if (error) {
                    if (options.error) {
                        options.error();
                    }
                } else {
                    var rawEvents = that.parseNewsResponse(xmlResponseString);

                    that.reset(rawEvents.slice(0, that.getMaxResults()));
                    that.trigger('update');

                    if (options.success) {
                        options.success();
                    }
                }
            });
        },

        parseNewsResponse: function(xmlString) {
            var that = this;
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

                var rssItem = new RssItem({
                    "title":  newsNode.find('title').text().trim(),
                    /* FIXME: Rewrite-HACK for #26 @ https://github.com/University-of-Potsdam-MM/rooms/issues/26 */
                    "imageSrc":  (imgNode.attr('src') || "").replace(/uploads\//, "uploads01/"),
                    "content": contentNode.text().trim(),
                    "publishedTimestamp":  moment(newsNode.find('published').text()).toDate(),
                    "updatedTimestamp":  moment(newsNode.find('updated').text()).toDate()
                });

                if (that.isValid(rssItem)) {
                    newsItems.push(rssItem);
                }
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

    return BaseRssCollection;
});