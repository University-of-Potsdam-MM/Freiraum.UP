define('models/NewsCollection', ["Backbone", "jquery", "config", "moment", "models/BaseRssCollection"], function (Backbone, $, config, moment, BaseRssCollection) {
    "use strict";

    var NewsCollection = BaseRssCollection.extend({

        initialize: function(models, attributes) {
            if (!config.get('news_rss_feed_url')) throw new Error('Missing config.news_rss_feed_url attribute for NewsCollection');
        },

        getFeedUrl: function() {
            return config.get('news_rss_feed_url');
        },

        comparator: function(a, b) {
            if (a.getUpdatedTimestamp().getTime() == b.getUpdatedTimestamp().getTime()) {
                return 0;
            }
            return a.getUpdatedTimestamp().getTime() > b.getUpdatedTimestamp().getTime() ? -1 : 1;
        }

    });

    return NewsCollection;
});