define('collections/transports', ["collections/TransportCollection", "config"], function (TransportCollection, config) {
    "use strict";

    var transports = new TransportCollection();

    transports.fetch({headers: {'Authorization': config.get('authorization')}});

    setInterval(function() {
        transports.fetch({headers: {'Authorization': config.get('authorization')}});
    }, config.get('transport_update_frequency') * 1000);

    return transports;
});