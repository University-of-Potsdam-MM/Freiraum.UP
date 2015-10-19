define('collections/events', ["models/EventCollection", "config"], function (EventCollection, config) {
    "use strict";

    var events = new EventCollection();
    events.fetch();

    setInterval(function() {
        events.fetch();
    }, config.get('events_update_frequency') * 1000);

    return events;
});