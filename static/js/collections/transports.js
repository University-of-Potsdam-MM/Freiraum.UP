define('collections/transports', ["collections/TransportCollection", "config"], function (TransportCollection, config) {
    "use strict";

    var transports = new TransportCollection();
    transports.fetch();

    setInterval(function() {
        transports.fetch();
    }, config.get('transport_update_frequency') * 1000);

    return transports;
});