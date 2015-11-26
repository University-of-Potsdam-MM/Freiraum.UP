define('models/Transport', ["Backbone", "jquery", "moment"], function (Backbone, $, moment) {
    "use strict";

    var Transport = Backbone.Model.extend({

        get: function (attr) {
            if (typeof this[attr] == 'function') {
              return this[attr]();
            }
            return Backbone.Model.prototype.get.call(this, attr);
        },

        TimeFormatted: function() {
            return moment(this.get('time')).format('HH:mm');
        },

        TimeTo: function() {
            return moment().to(this.get('time'), false);
        }
    });

    return Transport;
});