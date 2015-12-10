define('models/RssItem', ["Backbone", "jquery", "moment"], function (Backbone, $, moment) {
    "use strict";

    var RssItem = Backbone.Model.extend({

        get: function (attr) {
            if (typeof this[attr] == 'function') {
              return this[attr]();
            }
            return Backbone.Model.prototype.get.call(this, attr);
        },

        hasLocation: function() {
            return this.get('content').match(/^(.+), (.+) - /) ? true : false;
        },

        mainLocation: function() {
            var match = this.get('content').match(/^(.+?), (.+?) - /);
            return match && match[1];
        },

        location: function() {
            var match = this.get('content').match(/^(.+?), (.+?) - /);
            return match && match[2];
        }
    });

    return RssItem;
});