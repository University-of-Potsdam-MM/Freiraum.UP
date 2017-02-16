define('collections/freeRooms', ["collections/FreeRoomCollection", "config"], function (FreeRoomCollection, config) {
    "use strict";

    var freeRooms = new FreeRoomCollection();

    freeRooms.fetch({headers: {'Authorization': config.get('authorization')}});

    setInterval(function() {
        freeRooms.fetch({headers: {'Authorization': config.get('authorization')}});
    }, config.get('rooms_update_frequency') * 1000);

    return freeRooms;
});