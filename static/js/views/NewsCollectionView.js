define('views/NewsCollectionView', ["Backbone", "config", "jquery", "views/BaseView", "collections/news", "views/NewsView", "moment"], function (Backbone, config, $, BaseView, newsCollection, NewsView, moment) {
    "use strict";

    var NewsCollectionView = BaseView.extend({

        initialize: function() {
            if (!config.get('news_per_page')) throw new Error('Missing config.news_per_page attribute for EventCollectionView');

            this.listenTo(newsCollection, "update", this.render);
            this.render();
        },

        render: function() {

            var newsBody = $(this.el).find('.js_news_body');
            newsBody.empty();

            newsCollection.slice(0, config.get('news_per_page')).forEach(function(event) {
                var view = new NewsView({"model": event});
                newsBody.append(view.render().el);
            });

            if (newsCollection.length) {
                $(this.el).removeClass('is-hidden');
            } else {
                $(this.el).addClass('is-hidden');
            }
            BaseView.prototype.scaleView()
            return this;
        }
    });

    return NewsCollectionView;
});