define('collections/BookedRoomCollection', ["Backbone", "jquery", "config", "moment", "underscoreString", "models/BookedRoom"], function (Backbone, $, config, moment, _str, BookedRoom) {
    "use strict";

    var BookedRoomCollection = Backbone.Collection.extend({

        model: BookedRoom,

        initialize: function(models, attributes) {
            if (!config.get('house')) throw new Error('Missing config.house attribute for BookedRoomCollection');
            if (!config.get('campus')) throw new Error('Missing config.campus attribute for BookedRoomCollection');

            // listening for update every quarter hour
            this.listenTo(config, "change:tillNextUpdate", this.fetch);
        },

        comparator: function(a, b) {
            var roomA = a.get('room');
            var roomB = b.get('room');

            if (roomA == roomB)
            {
                return 0;
            }

            var value = roomA > roomB ? 1 : -1;

            /* Put H0, H1, etc at the beginning */

            if (roomA.substr(0, 1) == 'H' && roomB.substr(0, 1) == 'H'){
                return value;
            }

            if (roomA.substr(0, 1) == 'H' && roomB.substr(0, 1) != 'H'){
                return -1;
            }

            if (roomA.substr(0, 1) != 'H' && roomB.substr(0, 1) == 'H'){
                return 1;
            }

            /* default behaviour, if we don't have a H-Room involved */

            return value;
        },

        url: function(){
            // Set start and end time
            var now = config.get('now');
            var soon = config.get('soon');
            console.log(now.toISOString(), soon.toISOString());

            var request = config.get('base_url') + 'reservations?format=json&startTime=%s&endTime=%s&campus=%d&building=%s';
            return _str.sprintf(request, encodeURIComponent(now.toISOString()), encodeURIComponent(soon.toISOString()), config.get('campus'), config.get('house'));
        },

        parse: function(response){
            // only use rooms with valid title or name
            var filtered = response.reservationsResponse["return"].filter(
                function isVeranstaltung(value){
                    return (value.veranstaltung && value.veranstaltung != 'Raumreservierung');
                }
            );
            return filtered;
        }

    });

    return BookedRoomCollection;
});