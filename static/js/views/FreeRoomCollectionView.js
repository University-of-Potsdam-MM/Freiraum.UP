define('views/FreeRoomCollectionView', ["jquery", "config", "views/BaseView", "collections/freeRooms", "views/FreeRoomView"], function ($, config, BaseView, freeRoomsCollection, FreeRoomView) {
    "use strict";

    var FreeRoomCollectionView = BaseView.extend({

        initialize: function() {
            this.listenTo(freeRoomsCollection, "update", this.render);
            this.render();
        },

        render: function() {
            var that = this;
            //console.log('render free rooms:', config.get('now'));

            $(this.el).empty();

            if(freeRoomsCollection.length != 0){
                $(this.el).append("<h2>Freie Räume</h2>");
            }

            freeRoomsCollection.forEach(function(freeRoom) {
                var view = new FreeRoomView({"model": freeRoom, "tagName": "div"});
                $(that.el).append(view.render().el);
            })
        }
    });

    return FreeRoomCollectionView;
});