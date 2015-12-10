define('collections/freeRooms', ["models/FreeRoomCollection", "config"], function (FreeRoomCollection, config) {
    "use strict";

    var freeRooms = new FreeRoomCollection();
    freeRooms.fetch();

    setInterval(function() {
        freeRooms.fetch();
    }, config.get('rooms_update_frequency') * 1000);

    return freeRooms;
});