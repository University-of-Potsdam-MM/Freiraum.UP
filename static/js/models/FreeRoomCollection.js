define('models/FreeRoomCollection', ["Backbone", "jquery", "config", "moment", "models/FreeRoom", "collections/bookedRooms"], function (Backbone, $, config, moment, FreeRoom, bookedRoomsCollection) {
    "use strict";

    var FreeRoomCollection = Backbone.Collection.extend({
        model: FreeRoom,

        initialize: function(models, attributes) {
            if (!config.get('house')) throw new Error('Missing config.house attribute for BookedRoomCollection');
            if (!config.get('campus')) throw new Error('Missing config.campus attribute for BookedRoomCollection');

            this.listenTo(bookedRoomsCollection, "update", this.fetch);
            this.listenTo(config, "change:now", this.fetch);
        },

        comparator: function(a, b) {
            return a.get('room') == b.get('room') ? 0 : (a.get('room') > b.get('room') ? 1 : -1);
        },

        parseFreeRoomString: function(freeRoomString) {
            var rawFreeRoom = {
                "campus": null,
                "house": null,
                "room": freeRoomString
            };

            var that = this;
            var room_match = rawFreeRoom.room.match(/^([^\.]+)\.([^\.]+)\.(.+)/);

            if (room_match)
            {
                rawFreeRoom.campus = parseInt(room_match[1], 10);
                rawFreeRoom.house = parseInt(room_match[2], 10);
                rawFreeRoom.room = room_match[3];
            }

            return rawFreeRoom;
        },

        fetch: function(options) {
            options = options || {};
            var that = this;

            var now = config.get('now');

            $.ajax({
                'url': config.get('base_url') + 'rooms4Time',
                headers: {
                    'Authorization': config.get('authorization')
                },
                'data': {
                    // FIXME: rausnehmen, sobald die filterlogik funktioniert
                    'endTime': now.toISOString(),
                    'startTime': now.toISOString(),
                    'campus': config.get('campus'),
                    'cb': Math.random()
                },
                'dataType': 'xml'
            }).fail(function(response) {
                console.log('Error', response);
                if (options.error) {
                    options.error();
                }
            }).done(function (response) {
                var returns = $(response).find('return');

                var rawFreeRooms = [];

                // FIXME: rausnehmen, sobald die filterlogik bei rooms4Time richtig funktioniert
                var usedRooms = [];
                bookedRoomsCollection.forEach(function(bookedRoom) {
                    if (bookedRoom.isRunningAtTime(config.get('now'))) {
                        usedRooms.push(bookedRoom.get('room'));
                    }
                });

                returns.each(function(pos, freeRoomXmlNode) {
                    var rawFreeRoom = that.parseFreeRoomString($(freeRoomXmlNode).text());

                    if (rawFreeRoom.campus == config.get('campus') && rawFreeRoom.house == config.get('house') && usedRooms.indexOf(rawFreeRoom.room) == -1)
                    {
                        rawFreeRooms.push(rawFreeRoom);
                    }
                });

                that.reset(rawFreeRooms);
                that.trigger('update');

                if (options.success) {
                    options.success();
                }
            });
        }
    });

    return FreeRoomCollection;
});