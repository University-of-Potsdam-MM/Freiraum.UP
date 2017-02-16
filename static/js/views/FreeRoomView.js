define('views/FreeRoomView', ["Backbone", "config", "jquery"], function (Backbone, config, $) {
    "use strict";

    var FreeRoomView = Backbone.View.extend({

        tagName: "a",
        className: "btn btn-success",

        initialize: function(options) {
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            $(this.el).text(this.model.get('room'));
            return this;
        }
    });

    return FreeRoomView;
});