define('collections/bookedRooms', ["collections/BookedRoomCollection", "config"], function (BookedRoomCollection, config) {
    "use strict";

    var bookedRooms = new BookedRoomCollection();
    bookedRooms.fetch();

    setInterval(function() {
        bookedRooms.fetch();
    }, config.get('rooms_update_frequency') * 1000);

    return bookedRooms;
});