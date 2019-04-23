define('views/BookedRoomView', ["Backbone", "config", "moment", "collections/events"], function (Backbone, config, moment, eventsCollection) {
    "use strict";

    var BookedRoomView = Backbone.View.extend({

        initialize: function(options) {

            this.referenceTime = options.referenceTime;
            this.template = _.template('<div class="reservation <% if (is_highlighted){ %>is-highlighted<% } %> "><% _.each(rooms, function(room){ %><strong class="pull-right room"><%= room.room %></strong><% }); %><span class="info"><strong><%= name %></strong><span class="person"><% if (is_time_visible){ %>(<% } %><%= person %><% if (is_time_visible){ %>, <% } %></span><span class="time"><% if (is_time_visible){ %> bis <% } %><%= time %><% if (is_time_visible){ %>)<% } %></span></span></div>');

            this.listenTo(this.model, "change", this.render);
        },

        render: function() {

            this.is_time_visible = this.referenceTime.getTime() + 2 * 60 * 60 * 1000 != this.model.get('endTime').getTime() ? true : false;

            if (eventsCollection.findWhere({"title": this.model.get('name')})) {
                this.is_highlighted;
            }

            this.$el.html(this.template({name: this.model.get('name'), rooms: this.model.get('rooms'), person: this.model.get('shortPersonName'), time: moment(this.model.get('endTime')).format('HH:mm'), is_time_visible: this.is_time_visible, is_highlighted: this.is_highlighted}));

            return this;
        }
    });

    return BookedRoomView;
});