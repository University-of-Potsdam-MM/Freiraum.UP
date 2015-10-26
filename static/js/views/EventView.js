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
            tr.find('td').css('background-image', 'url(\'' + this.model.getImageSrc() + '\')');
            var location = '';

            /* FIXME: highlighten, wenn das Event von diesem Ort ist! */
            if (this.model.hasLocation()) {
                if (this.model.getMainLocation() == 'Universität Potsdam') {
                    location = this.model.getLocation() + ', ';
                } else {
                    location = this.model.getMainLocation() + ', ' + this.model.getLocation() + ', ';
                }
            }
            tr.find('.news-title').text(this.model.getTitle() + ' (' + location + moment(this.model.getUpdatedTimestamp()).format('DD.MM.YYYY HH:mm') + ')');

            if (config.get('event_location') == this.model.getLocation()) {
                tr.addClass('is-highlighted');
            }

            return this;
        }
    });

    return EventView;
});



