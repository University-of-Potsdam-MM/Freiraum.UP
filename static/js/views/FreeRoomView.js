define('views/FreeRoomView', ["Backbone", "config", "jquery"], function (Backbone, config, $) {
    "use strict";

    var FreeRoomView = Backbone.View.extend({

        tagName: "a",

        initialize: function(options) {
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            var a_element = $(this.el);
            a_element.addClass('btn');
            a_element.addClass('btn-success');
            a_element.text(this.model.get('room'));
            a_element.css('margin', '3px');

            return this;
        }
    });

    return FreeRoomView;
});


