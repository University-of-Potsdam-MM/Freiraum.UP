define('views/NewsView', ["Backbone", "config", "jquery", "moment"], function (Backbone, config, $, moment) {
    "use strict";

    var NewsView = Backbone.View.extend({

        tagName: "div",
        className: "news-container row-fluid",

        initialize: function(options) {
            this.template = _.template('<img src="<%= img %>" class="img-responsive"/><div class="news-title"><%= title %></div>');
           
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