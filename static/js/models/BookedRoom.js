define('models/BookedRoom', ["Backbone", "jquery", "moment"], function (Backbone, $, moment) {
    "use strict";

    var BookedRoom = Backbone.Model.extend({

        defaults: {
            name: null,
            shortCode: null,
            startTime: null,
            endTime: null,
            personName: null,
            shortPersonName: null,
            campus: null,
            house: null,
            room: null
        },

        parse: function(response){
            var that = this;
            var room_match = response.roomList.room.match(/^([^\.]+)\.([^\.]+)\.(.+)/);

             return {
                // name replace(/.+?\/.+? - /, '').replace(/ (I+)[: ].+$/, ' $1'), ??
                name: response.veranstaltung,
                shortCode: that.shortCode(response.veranstaltung),
                startTime: new Date(response.startTime),
                endTime: new Date(response.endTime),
                personName: response.personList.person[0],
                shortPersonName: that.shortPersonName(response.personList.person[0]),
                campus: parseInt(room_match[1], 10),
                house: parseInt(room_match[2], 10),
                room: room_match[3]
            }
        },


        isRunningAtTime: function(time) {
            if (this.get('startTime').getTime() <= time.getTime() && time.getTime() < this.get('endTime').getTime()){
                return true;
            }
            return false;
        },

        shortCode: function(name){
            var name_without_latin_numbers = name.replace(/ I+$/, "");
            var latin_numbers_suffix = name.match(/ I+$/) || "";

            return (" " + name_without_latin_numbers).match(/ [a-zA-Z]/g).join('').replace(/ /g, '') + latin_numbers_suffix;
        },

        shortPersonName: function (personName){
            var short_person_name = personName.replace(/(Dr. |Prof.)/g, '');
            short_person_name = short_person_name.match(/[A-Z]/g).join('.') + '.';

            if (!short_person_name){
                short_person_name = 'N.N';
            }
            return short_person_name;
        }

    });

    return BookedRoom;
});