define('collections/FreeRoomCollection', ["Backbone", "jquery", "config", "moment", "underscoreString", "models/FreeRoom"], function (Backbone, $, config, moment, _str, FreeRoom) {
    "use strict";

    var FreeRoomCollection = Backbone.Collection.extend({

        model: FreeRoom,

        initialize: function(models, attributes) {
            if (!config.get('house')) throw new Error('Missing config.house attribute for BookedRoomCollection');
            if (!config.get('campus')) throw new Error('Missing config.campus attribute for BookedRoomCollection');

            // listening for update every quarter hour
            this.listenTo(config, "change:tillNextUpdate", this.fetch);
        },

        url: function(){

            // Set start and end time
            var now = config.get('now');
            var soon = config.get('soon');
            console.log(now.toISOString(), soon.toISOString());

            var request = config.get('base_url') + 'rooms4Time?format=json&startTime=%s&endTime=%s&campus=%d&building=%s';
            return _str.sprintf(request, encodeURIComponent(now.toISOString()), encodeURIComponent(soon.toISOString()), config.get('campus'), config.get('house'));

        },

        comparator: function(a, b) {
            return a.get('room') == b.get('room') ? 0 : (a.get('room') > b.get('room') ? 1 : -1);
        },

        parse: function(response){
            return response.rooms4TimeResponse["return"];
        }
    });

    return FreeRoomCollection;
});