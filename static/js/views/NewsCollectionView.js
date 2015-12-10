define('views/NewsCollectionView', ["Backbone", "config", "jquery", "views/BaseView", "collections/news", "views/NewsView", "moment"], function (Backbone, config, $, BaseView, newsCollection, NewsView, moment) {
    "use strict";

    var NewsCollectionView = BaseView.extend({

        initialize: function() {
            if (!config.get('news_per_page')) throw new Error('Missing config.news_per_page attribute for EventCollectionView');

            this.listenTo(newsCollection, "update", this.render);
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

            newsCollection.slice(0, config.get('news_per_page')).forEach(function(event) {
                var view = new NewsView({"model": event, "tagName": "tr"});
                newsTableBody.append(view.render().el);
            });

            return this;
        }
    });

    return NewsCollectionView;
});



