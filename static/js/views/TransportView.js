define('views/TransportView', ["Backbone", "config", "jquery"], function (Backbone, config, $) {
    "use strict";

    var TransportView = Backbone.View.extend({

        tagName: "tr",

        initialize: function(options) {
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            var that = this;
            var tr = $(this.el);

            tr.html('<td class="js_journey_name"></td><td class="journey_dir_platf"><p class="js_journey_direction"></p><p class="js_journey_platform"></p></td><td class="js_journey_time_absolute"></td><td class="js_journey_time_relative"></td>');
            tr.find('.js_journey_name').text(that.model.getName());
            tr.find('.js_journey_name').addClass(that.model.getCategory());
            tr.find('.js_journey_direction').text(that.model.getDirection());
            tr.find('.js_journey_time_absolute').text(that.model.getTimeFormatted());
            tr.find('.js_journey_time_relative').text(that.model.getTimeTo());
            if (that.model.getPlatform()) {
                tr.find('.js_journey_platform').text('Gleis ' + that.model.getPlatform());
            } else {
                tr.find('.js_journey_platform').text(that.model.getPlatform());
            }

            return this;
        }
    });

    return TransportView;
});



