define('views/SoonBookedRoomCollectionView', ["jquery", "config", "views/BaseView", "collections/bookedRooms", "views/BookedRoomView"], function ($, config, BaseView, bookedRoomsCollection, BookedRoomView) {
    "use strict";

    var SoonBookedRoomCollectionView = BaseView.extend({

        initialize: function() {
            this.listenTo(bookedRoomsCollection, "update", this.render);
            this.listenTo(config, "change:soon", this.render);
            this.render();
        },

        render: function() {
            var that = this;
            var listBody = $(this.el).find('.js_body');
            $(this.el).find('.js_headline').text('Demnächst (ab ' + config.get('soon').toLocaleTimeString().replace(/:\d\d$/g, '') + ' Uhr)');

            listBody.empty();

            var runningCount = 0;

            bookedRoomsCollection.each(function(bookedRoom) {

                if (bookedRoom.isRunningAtTime(config.get('soon'))){
                    runningCount += 1;
                    var view = new BookedRoomView({"model": bookedRoom, "tagName": "div", "referenceTime": config.get('soon')});
                    listBody.append(view.render().el);
                }
            });

            if (runningCount){
                $(this.el).removeClass('is-hidden');
            }else{
                $(this.el).addClass('is-hidden');
                var div_element = $(document.createElement('div'));
                div_element.addClass('alert alert-info');
                div_element.text('Keine Veranstaltungen');
                listBody.append(div_element);
            }
        }
    });

    return SoonBookedRoomCollectionView;
});