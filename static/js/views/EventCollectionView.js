define('views/EventCollectionView', ["Backbone", "config", "jquery", "views/BaseView", "collections/events", "views/EventView", "moment"], function (Backbone, config, $, BaseView, eventsCollection, EventView, moment) {
    "use strict";

    var EventCollectionView = BaseView.extend({

        initialize: function() {
            if (!config.get('news_per_page')) throw new Error('Missing config.news_per_page attribute for EventCollectionView');

            this.listenTo(eventsCollection, "update", this.render);
            this.render();
        },

        render: function() {
            var that = this;
            var tr = $(this.el);

            var newsTableBody = $(this.el).find('.js_news_tbody');
            var newsTable = $(this.el).find('.js_news');

            newsTableBody.empty();
            newsTable.css('height', 'calc(90% - ' + ($('.free-rooms').outerHeight() + 38 + 100) + 'px)');
            newsTable.css('margin-bottom', '0');

            var notYetStartedEvents = [];

            eventsCollection.forEach(function(event) {
                if (moment(event.getUpdatedTimestamp()).toDate().getTime() > moment().toDate().getTime()) {
                    notYetStartedEvents.push(event);
                }
            });

            notYetStartedEvents.slice(0, config.get('news_per_page')).forEach(function(event) {
                var view = new EventView({"model": event, "tagName": "tr"});
                newsTableBody.append(view.render().el);
            });

            return this;
        }
    });

    return EventCollectionView;
});



