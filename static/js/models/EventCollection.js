define('models/EventCollection', ["Backbone", "jquery", "config", "moment", "models/BaseRssCollection"], function (Backbone, $, config, moment, BaseRssCollection) {
    "use strict";

    var EventCollection = BaseRssCollection.extend({

        initialize: function(models, attributes) {
            if (!config.get('events_rss_feed_url')) throw new Error('Missing config.events_rss_feed_url attribute for EventCollection');
        },

        getFeedUrl: function() {
            return config.get('events_rss_feed_url');
        },

        comparator: function(a, b) {
            if (a.getUpdatedTimestamp().getTime() == b.getUpdatedTimestamp().getTime()) {
                return 0;
            }
            return a.getUpdatedTimestamp().getTime() < b.getUpdatedTimestamp().getTime() ? -1 : 1;
        }

    });

    return EventCollection;
});