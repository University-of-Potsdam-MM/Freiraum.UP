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

            /* FIXME: hack damit das bei split nicht benutzt wird! hier wäre besseres CSS besser. */
/*
            if (document.location.toString().indexOf('split.html') === -1) {
                newsBody.css('height', 'calc(90% - ' + ($('.free-rooms').outerHeight() + 38 + 100) + 'px)');
                newsBody.css('margin-bottom', '0');
            }
*/
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