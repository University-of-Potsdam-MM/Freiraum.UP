define('views/NewsCollectionView', ["Backbone", "config", "jquery", "views/BaseView", "collections/news", "views/NewsView", "moment"], function (Backbone, config, $, BaseView, newsCollection, NewsView, moment) {
    "use strict";

    var NewsCollectionView = BaseView.extend({

        initialize: function(options) {
            $(window).on("resize",this.scaleView)
            if (!config.get('news_per_page')) throw new Error('Missing config.news_per_page attribute for EventCollectionView');

            this.options = options || {};
            this.options.offset = parseInt(this.options.offset || "0", 10);

            this.listenTo(newsCollection, "update", this.render);
            this.render();
        },

        render: function() {

            var newsBody = $(this.el).find('.js_news_body');
            newsBody.empty();

            newsCollection.slice(this.options.offset, this.options.offset + config.get('news_per_page')).forEach(function(event) {
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