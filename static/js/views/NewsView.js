define('views/NewsView', ["Backbone", "config", "jquery", "moment"], function (Backbone, config, $, moment) {
    "use strict";

    var NewsView = Backbone.View.extend({

        tagName: "div",
        className: "news-container",

        initialize: function(options) {
            this.template = _.template('<div class="news-img"><img src="<%= img %>"/><div class="news-title"><%= title %></div></div>');
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            console.log(this.model);
            this.$el.html(this.template({title: this.model.get('title'), publishedTimestamp: moment(this.model.get('publishedTimestamp')).format('DD.MM.YYYY'), img: this.model.get('imageSrc')}));
            return this;
        }
    });

    return NewsView;
});