define('models/Transport', ["Backbone", "jquery", "moment"], function (Backbone, $, moment) {
    "use strict";

    var Transport = Backbone.Model.extend({

        getName: function() {
            return this.get('name');
        },

        getCategory: function() {
            return this.get('category');
        },

        getPlatform: function() {
            return this.get('platform');
        },

        getStationName: function() {
            return this.get('stationName');
        },

        getDirection: function() {
            return this.get('direction');
        },

        getTime: function() {
            return this.get('time');
        },

        getTimeFormatted: function() {
            return moment(this.getTime()).format('HH:mm');
        },

        getTimeTo: function() {
            return moment().to(this.getTime(), false);
        }
    });

    return Transport;
});