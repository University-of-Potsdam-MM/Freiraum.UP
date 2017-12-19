define('collections/TransportCollection', ["Backbone", "jquery", "config", "moment", "models/Transport"], function (Backbone, $, config, moment, Transport) {
    "use strict";

    var TransportCollection = Backbone.Collection.extend({
        model: Transport,

        initialize: function(models, attributes) {
            if (!config.get('transport_station_id')) throw new Error('Missing config.transport_station_id attribute for TransportCollection');
            if (!config.get('transport_count')) throw new Error('Missing config.transport_count attribute for TransportCollection');
            if (!config.get('transport_base_url')) throw new Error('Missing config.transport_base_url attribute for TransportCollection');
            if (!config.get('authorization')) throw new Error('Missing config.authorization attribute for TransportCollection');
        },

        url: function(){
            var url = config.get('transport_base_url') + 'departureBoard';
                url += '?maxJourneys=' + config.get('transport_count');
                url += '&format=json';
                url += '&id=' + config.get('transport_station_id');
                url += '&time=' + encodeURIComponent(moment().format('HH:mm:ss'));
            return url;
        },

        comparator: 'time',

        parse: function(response){
            // FIX: API returns departures which are already outdated
            var result = _.filter(response.Departure, function(dep){
                return dep.time > moment().format('HH:mm:ss');
            });

            return result;
        }
    });

    return TransportCollection;
});