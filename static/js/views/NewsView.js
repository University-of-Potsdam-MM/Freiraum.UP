define('views/NewsView', ["Backbone", "config", "jquery", "moment"], function (Backbone, config, $, moment) {
    "use strict";

    var NewsView = Backbone.View.extend({

        tagName: "div",
        className: "news-container row-fluid",

         attributes: function(){
            return {
                style: "background-image:url('"+ this.model.get('imageSrc')+"');"
            };
        },

        initialize: function(options) {
            this.template = _.template('<div class="news-title"><%= title %></div>');
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            this.$el.html(this.template({title: this.model.get('title'), publishedTimestamp: moment(this.model.get('publishedTimestamp')).format('DD.MM.YYYY')}));
            return this;
        }
    });

    return NewsView;
});