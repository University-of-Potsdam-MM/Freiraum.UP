define('models/BookedRoomCollection', ["Backbone", "jquery", "config", "moment", "models/BookedRoom"], function (Backbone, $, config, moment, BookedRoom) {
    "use strict";

    var BookedRoomCollection = Backbone.Collection.extend({
        model: BookedRoom,

        initialize: function(models, attributes) {
            if (!config.get('house')) throw new Error('Missing config.house attribute for BookedRoomCollection');
            if (!config.get('campus')) throw new Error('Missing config.campus attribute for BookedRoomCollection');
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
            if (roomA.substr(0, 1) == 'H' && roomB.substr(0, 1) == 'H')
            {
                return value;
            }

            if (roomA.substr(0, 1) == 'H' && roomB.substr(0, 1) != 'H')
            {
                return -1;
            }

            if (roomA.substr(0, 1) != 'H' && roomB.substr(0, 1) == 'H')
            {
                return 1;
            }

            /* default behaviour, if we don't have a H-Room involved */

            return value;
        },

        parseBookedRoomXml: function(bookedRoomXml) {
            bookedRoomXml = $(bookedRoomXml);

            var rawBookedRoom = {
                "name": bookedRoomXml.find('veranstaltung').text().replace(/.+?\/.+? - /, '').replace(/ (I+)[: ].+$/, ' $1'),
                "start_time": bookedRoomXml.find('startTime').text(),
                "end_time": bookedRoomXml.find('endTime').text(),
                "campus": bookedRoomXml.find('roomList > room').text(),
                "house": bookedRoomXml.find('roomList > room').text(),
                "room": bookedRoomXml.find('roomList > room').text(),
                "person_name": bookedRoomXml.find('personList > person:first').text()
            };

            var room_match = rawBookedRoom.room.match(/^([^\.]+)\.([^\.]+)\.(.+)/);

            if (rawBookedRoom.name && room_match && rawBookedRoom.name != 'Raumreservierung')
            {
                rawBookedRoom.campus = parseInt(room_match[1], 10);
                rawBookedRoom.house = parseInt(room_match[2], 10);
                rawBookedRoom.room = room_match[3];

                /* Because sometimes there double escaped XML entities in the response ... */
                //rawBookedRoom.name = $('<textarea/>').html(rawBookedRoom.name).val();;
            };

            return rawBookedRoom;
        },

        fetch: function(options) {
            options = options || {};
            var that = this;

            var now = config.get('now');
            var soon = new Date();
            soon.setTime(now.getTime() + 2 * 60 * 60 * 1000);
            var end_of_soon = new Date();
            end_of_soon.setTime(soon.getTime() + 2 * 60 * 60 * 1000);

            $.ajax({
                'url': config.get('base_url') + 'reservations',
                headers: {
                    'Authorization': config.get('authorization')
                },
                'data': {
                    'endTime': end_of_soon.toISOString(),
                    'startTime': now.toISOString(),
                    'campus': config.get('campus'),
                    'cb': Math.random()
                },
                'dataType': 'xml'
            }).fail(function(response) {
                if (options.error) {
                    options.error();
                }
            }).done(function (response) {
                var returns = $(response).find('return');

                var rawBookedRooms = [];

                returns.each(function(pos, bookedRoomXml) {
                    var rawBookedRoom = that.parseBookedRoomXml(bookedRoomXml);

                    if (rawBookedRoom.campus == config.get('campus') && rawBookedRoom.house == config.get('house'))
                    {
                        rawBookedRooms.push(rawBookedRoom);
                    }
                });

                that.reset(rawBookedRooms);
                that.trigger('update');

                if (options.success) {
                    options.success();
                }
            });
        }
    });

    return BookedRoomCollection;
});