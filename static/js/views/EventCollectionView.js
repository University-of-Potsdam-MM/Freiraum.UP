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
            /* FIXME: hack damit das bei split nicht benutzt wird! hier wäre besseres CSS besser. */
            if (document.location.toString().indexOf('split.html') === -1) {
                newsTable.css('height', 'calc(90% - ' + ($('.free-rooms').outerHeight() + 38 + 100) + 'px)');
                newsTable.css('margin-bottom', '0');
            }

            eventsCollection.forEach(function(event) {
                var view = new EventView({"model": event, "tagName": "tr"});
                newsTableBody.append(view.render().el);
            });

            if (eventsCollection.length) {
                $(this.el).removeClass('is-hidden');
            } else {
                $(this.el).addClass('is-hidden');
            }

            return this;
        }
    });

    return EventCollectionView;
});



