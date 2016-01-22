define('views/NewsCollectionView', ["Backbone", "config", "jquery", "views/BaseView", "collections/news", "views/NewsView", "moment"], function (Backbone, config, $, BaseView, newsCollection, NewsView, moment) {
    "use strict";

    var NewsCollectionView = BaseView.extend({

        initialize: function(options) {
            if (!config.get('news_per_page')) throw new Error('Missing config.news_per_page attribute for EventCollectionView');

            this.options = options || {};
            this.options.offset = parseInt(this.options.offset || "0", 10);

            this.listenTo(newsCollection, "update", this.render);
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

            newsCollection.slice(this.options.offset, this.options.offset + config.get('news_per_page')).forEach(function(event) {
                var view = new NewsView({"model": event, "tagName": "tr"});
                newsTableBody.append(view.render().el);
            });

            if (newsCollection.length) {
                $(this.el).removeClass('is-hidden');
            } else {
                $(this.el).addClass('is-hidden');
            }

            return this;
        }
    });

    return NewsCollectionView;
});



