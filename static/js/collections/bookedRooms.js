define('collections/bookedRooms', ["collections/BookedRoomCollection", "config"], function (BookedRoomCollection, config) {
    "use strict";

    var bookedRooms = new BookedRoomCollection();
    
    bookedRooms.fetch({headers: {'Authorization': config.get('authorization')}});

    setInterval(function() {
        bookedRooms.fetch({headers: {'Authorization': config.get('authorization')}});
    }, config.get('rooms_update_frequency') * 1000);

    return bookedRooms;
});