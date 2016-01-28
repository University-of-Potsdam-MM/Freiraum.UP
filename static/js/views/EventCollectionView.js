define('views/EventCollectionView', ["Backbone", "config", "jquery", "views/BaseView", "collections/events", "views/EventView", "moment"], function (Backbone, config, $, BaseView, eventsCollection, EventView, moment) {
    "use strict";

    var EventCollectionView = BaseView.extend({

        initialize: function(options) {
            $(window).on("resize",this.scaleView)
            if (!config.get('news_per_page')) throw new Error('Missing config.news_per_page attribute for EventCollectionView');

            this.options = options || {};
            this.options.offset = parseInt(this.options.offset || "0", 10);

            this.listenTo(eventsCollection, "update", this.render);
            this.render();
        },

        render: function() {

            var newsBody = $(this.el).find('.js_news_body');
            newsBody.empty();

            eventsCollection.slice(this.options.offset, this.options.offset + config.get('news_per_page')).forEach(function(event) {
                var view = new EventView({"model": event});
                newsBody.append(view.render().el);
            });

            if (eventsCollection.length) {
                $(this.el).removeClass('is-hidden');
            } else {
                $(this.el).addClass('is-hidden');
            }
            BaseView.prototype.scaleView()
            return this;
        }
    });

    return EventCollectionView;
});