define('views/NowBookedRoomCollectionView', ["jquery", "config", "views/BaseView", "collections/bookedRooms", "views/BookedRoomView"], function ($, config, BaseView, bookedRoomsCollection, BookedRoomView) {
    "use strict";

    var NowBookedRoomCollectionView = BaseView.extend({

        initialize: function() {
            var that = this;

            this.listenTo(bookedRoomsCollection, "update", this.render);
            this.listenTo(config, "change:now", this.render);
            this.render();
        },

        render: function() {
            var that = this;
            console.log('render booked rooms');
            $(this.el).find('.js_headline').text('Jetzt (' + config.get('now').toLocaleTimeString().replace(/:\d\d$/g, '') + ' - ' + config.get('soon').toLocaleTimeString().replace(/:\d\d$/g, '') + ' Uhr)');

            var listBody = $(this.el).find('.js_body');

            listBody.empty();

            var runningCount = 0;

            bookedRoomsCollection.forEach(function(bookedRoom) {

                if (bookedRoom.isRunningAtTime(config.get('now')))
                {
                    runningCount += 1;
                    var view = new BookedRoomView({"model": bookedRoom, "tagName": "div", "referenceTime": config.get('now')});
                    listBody.append(view.render().el);
                }
            });

            if (runningCount) {
                $(this.el).removeClass('is-hidden');
            } else {
                $(this.el).addClass('is-hidden');
                var div_element = $(document.createElement('div'));
                div_element.addClass('alert alert-info');
                div_element.text('Keine Veranstaltungen');
                listBody.append(div_element);
            }
        }
    });

    return NowBookedRoomCollectionView;
});


