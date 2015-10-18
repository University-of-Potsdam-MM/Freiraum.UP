define('models/FreeRoom', ["Backbone", "jquery", "moment"], function (Backbone, $, moment) {
    "use strict";

    var FreeRoom = Backbone.Model.extend({
        initialize: function(attributes) {
        },

        getRoom: function()
        {
            return this.get('room');
        },
        getHouse: function()
        {
            return this.get('house');
        },
        getCampus: function()
        {
            return this.get('campus');
        }
    });

    return FreeRoom;
});