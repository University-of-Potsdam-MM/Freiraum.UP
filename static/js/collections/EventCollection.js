define('collections/EventCollection', ["Backbone", "jquery", "config", "moment", "collections/BaseRssCollection"], function (Backbone, $, config, moment, BaseRssCollection) {
    "use strict";

    var EventCollection = BaseRssCollection.extend({

        initialize: function(models, attributes) {
            if (!config.get('events_rss_feed_url')) throw new Error('Missing config.events_rss_feed_url attribute for EventCollection');
        },

        isValid: function(rssItem) {
            if (moment(rssItem.get('updatedTimestamp')).toDate().getTime() > moment().toDate().getTime()) {
                return true;
            }

            return false;
        },

        getFeedUrl: function() {
            return config.get('events_rss_feed_url');
        },

        comparator: function(a, b) {
            if (a.get('updatedTimestamp').getTime() == b.get('updatedTimestamp').getTime()) {
                return 0;
            }
            return a.get('updatedTimestamp').getTime() < b.get('updatedTimestamp').getTime() ? -1 : 1;
        }

    });

    return EventCollection;
});