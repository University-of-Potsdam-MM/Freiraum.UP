define('models/BookedRoom', ["Backbone", "jquery", "moment"], function (Backbone, $, moment) {
    "use strict";

    var BookedRoom = Backbone.Model.extend({
        initialize: function(attributes) {
        },

        get: function (attr) {
            if (typeof this[attr] == 'function') {
              return this[attr]();
            }
            return Backbone.Model.prototype.get.call(this, attr);
        },

        shortCode: function()
        {
            var name_without_latin_numbers = this.get('name').replace(/ I+$/, "");
            var latin_numbers_suffix = this.get('name').match(/ I+$/) || "";

            return (" " + name_without_latin_numbers).match(/ [a-zA-Z]/g).join('').replace(/ /g, '') + latin_numbers_suffix;
        },

        shortPersonName: function ()
        {
            var short_person_name = this.get('person_name').replace(/(Dr. |Prof.)/g, '');
            short_person_name = short_person_name.match(/[A-Z]/g).join('.') + '.';

            if (!short_person_name)
            {
                short_person_name = 'N.N';
            }

            return short_person_name;
        },

        startTime: function()
        {
            return new Date(this.get('start_time'));
        },

        startTimeAsTimeString: function()
        {
            return this.dateAsTimeString(this.get('startTime'));
        },

        endTime: function()
        {
            return new Date(this.get('end_time'));
        },

        endTimeAsTimeString: function()
        {
            return this.dateAsTimeString(this.get('endTime'));
        },

        dateAsTimeString: function(date)
        {
            var hours = date.getHours();
            var minutes = date.getMinutes();

            if (hours < 10)
            {
                hours = "0" + hours;
            }

            if (minutes < 10)
            {
                minutes = "0" + minutes;
            }

            return hours + ':' + minutes;
        },

        isRunningAtTime: function(time)
        {
            if (this.get('startTime').getTime() <= time.getTime() && time.getTime() < this.get('endTime').getTime())
            {
                return true;
            }

            return false;
        }
    });

    return BookedRoom;
});