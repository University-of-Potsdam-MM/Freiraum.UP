define('views/BookedRoomView', ["Backbone", "config"], function (Backbone, config) {
    "use strict";

    var BookedRoomView = Backbone.View.extend({

        tagName: "div",

        initialize: function(options) {

            this.referenceTime = options.referenceTime;

            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            var div_element = $(this.el);
            var room_element = $(document.createElement('strong'));
            var info_element = $(document.createElement('span'));
            var person_element = $(document.createElement('span'));
            var time_element = $(document.createElement('span'));

            div_element.addClass('reservation');

            room_element.text(this.model.getRoom());
            room_element.addClass('pull-right');
            room_element.addClass('room');

            var text = this.model.getName();
            text = this.model.getShortCode();
            var strong_info = $('<strong />');
            strong_info.text(this.model.getName());

            info_element.append(strong_info);
            info_element.addClass('info');

            var is_time_visible = this.referenceTime.getTime() + 2 * 60 * 60 * 1000 != this.model.getEndTime().getTime() ? true : false;

            if (is_time_visible)
            {
                person_element.text('(' + this.model.getShortPersonName() + ', ');
                time_element.text(this.model.getStartTimeAsTimeString() + ' - ' + this.model.getEndTimeAsTimeString());
                time_element.text('bis ' + this.model.getEndTimeAsTimeString() + ')');
            }
            else
            {
                person_element.text('(' + this.model.getShortPersonName() + ')');
                time_element.text('');
            }
            person_element.addClass('person');
            time_element.addClass('time');
            div_element.append(room_element);
            div_element.append(info_element);
            info_element.append(person_element);
            info_element.append(time_element);

            return this;
        }
    });

    return BookedRoomView;
});


