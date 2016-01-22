define('models/NewsCollection', ["Backbone", "jquery", "config", "moment", "models/BaseRssCollection"], function (Backbone, $, config, moment, BaseRssCollection) {
    "use strict";

    var NewsCollection = BaseRssCollection.extend({

        initialize: function(models, attributes) {
            if (!config.get('news_rss_feed_url')) throw new Error('Missing config.news_rss_feed_url attribute for NewsCollection');
        },

        isValid: function(rssItem) {
            return true;
        },

        getFeedUrl: function() {
            return config.get('news_rss_feed_url');
        },

        comparator: function(a, b) {
            if (a.get('updatedTimestamp').getTime() == b.get('updatedTimestamp').getTime()) {
                return 0;
            }
            return a.get('updatedTimestamp').getTime() > b.get('updatedTimestamp').getTime() ? -1 : 1;
        }

    });

    return NewsCollection;
});