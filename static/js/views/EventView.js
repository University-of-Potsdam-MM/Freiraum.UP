define('views/EventView', ["Backbone", "config", "jquery", "moment"], function (Backbone, config, $, moment) {
    "use strict";

    var EventView = Backbone.View.extend({

        tagName: "div",
        className: "news-container row-fluid news-img",

        initialize: function(options) {
           // this.template = _.template('<img src="<%= img %>" class="img-responsive"/><div class="news-title"><%= title %></div>');
             this.template = _.template('<div class="news-img" style="background-image:url(<%= img %>);" /><div class="news-title"><%= title %></div>');
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {

            var location = '';

            /* FIXME: highlighten, wenn das Event von diesem Ort ist! */
            if (this.model.get('hasLocation')) {
                if (this.model.get('mainLocation') == 'Universität Potsdam') {
                    location = this.model.get('location') + ', ';
                } else {
                    location = this.model.get('mainLocation') + ', ' + this.model.get('location') + ', ';
                }
            }

            if (config.get('event_location') == this.model.get('location')) {
                tr.addClass('is-highlighted');
            }

            this.$el.html(this.template({title: this.model.get('title'), publishedTimestamp: moment(this.model.get('publishedTimestamp')).format('DD.MM.YYYY'), img: this.model.get('imageSrc')}));
            return this;
        }
    });

    return EventView;
});