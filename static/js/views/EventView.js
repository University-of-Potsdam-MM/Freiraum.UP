define('views/EventView', ["Backbone", "config", "jquery", "moment"], function (Backbone, config, $, moment) {
    "use strict";

    var EventView = Backbone.View.extend({

        tagName: "div",
        className: "news-container row-fluid",

        attributes: function(){
            return {
                style: "background-image:url('"+ this.model.get('imageSrc')+"');"
            };
        },

        initialize: function(options) {
            this.template = _.template('<div class="news-title"><%= title %> (<%= location %> <%= updatedTimestamp %>)</div>');
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {

            var location = '';

            if (this.model.get('hasLocation')) {
                if (this.model.get('mainLocation') == 'Universität Potsdam') {
                    location = this.model.get('location') + ', ';
                } else {
                    location = this.model.get('mainLocation') + ', ' + this.model.get('location') + ', ';
                }
            }

            if (config.get('event_location') == this.model.get('location')) {
                this.$el.addClass('is-highlighted');
            }

            this.$el.html(this.template({title: this.model.get('title'), location: location, updatedTimestamp: moment(this.model.get('updatedTimestamp')).format('DD.MM.YYYY')}));
            return this;
        }
    });

    return EventView;
});