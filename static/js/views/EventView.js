define('views/EventView', ["Backbone", "config", "jquery", "moment"], function (Backbone, config, $, moment) {
    "use strict";

    var EventView = Backbone.View.extend({

        tagName: "tr",

        initialize: function(options) {
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            var that = this;
            var tr = $(this.el);

            tr.html('<td class="news-td" colspan="2"><div class="news-title">Das ist der Titel</div></td>');
            tr.find('td').css('background-image', 'url(\'' + this.model.get('imageSrc') + '\')');
            var location = '';

            /* FIXME: highlighten, wenn das Event von diesem Ort ist! */
            if (this.model.get('hasLocation')) {
                if (this.model.get('mainLocation') == 'Universität Potsdam') {
                    location = this.model.get('location') + ', ';
                } else {
                    location = this.model.get('mainLocation') + ', ' + this.model.get('location') + ', ';
                }
            }
            tr.find('.news-title').text(this.model.get('title') + ' (' + location + moment(this.model.get('updatedTimestamp')).format('DD.MM.YYYY HH:mm') + ')');

            if (config.get('event_location') == this.model.get('location')) {
                tr.addClass('is-highlighted');
            }

            return this;
        }
    });

    return EventView;
});