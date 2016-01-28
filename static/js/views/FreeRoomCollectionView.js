define('views/FreeRoomCollectionView', ["jquery", "config", "views/BaseView", "collections/freeRooms", "views/FreeRoomView"], function ($, config, BaseView, freeRoomsCollection, FreeRoomView) {
    "use strict";

    var FreeRoomCollectionView = BaseView.extend({

        initialize: function() {
            var that = this;

            this.listenTo(freeRoomsCollection, "update", this.render);
            this.listenTo(config, "change:now", this.render);
            this.render();
        },

        render: function() {
            var that = this;
            console.log('render free rooms');

            $(this.el).empty();

            freeRoomsCollection.forEach(function(freeRoom) {
                var view = new FreeRoomView({"model": freeRoom, "tagName": "div"});
                $(that.el).append(view.render().el);
            })
        }
    });

    return FreeRoomCollectionView;
});


