define('collections/TransportCollection', ["Backbone", "jquery", "config", "moment", "models/Transport"], function (Backbone, $, config, moment, Transport) {
    "use strict";

    var TransportCollection = Backbone.Collection.extend({
        model: Transport,

        initialize: function(models, attributes) {
            if (!config.get('station_id')) throw new Error('Missing config.station_id attribute for TransportCollection');
            if (!config.get('transport_base_url')) throw new Error('Missing config.transport_base_url attribute for TransportCollection');
            if (!config.get('authorization')) throw new Error('Missing config.authorization attribute for TransportCollection');
        },

        comparator: 'time',

        fetch: function(options) {
            options = options || {};
            var that = this;

            var xmlString = '<STBReq boardType="DEP" maxJourneys="20" sortOrder="REALTIME"><Time>' + moment().format('HH:mm:ss') + '</Time><Today/><TableStation externalId="' + config.get('station_id') + '"/><ProductFilter>1111111111111111</ProductFilter></STBReq>';
            this.rawCall(xmlString, function(error, xmlResponseString) {
                if (error) {
                    if (options.error) {
                        options.error();
                    }
                } else {
                    var rawTransports = that.parseJourneyListResponse(xmlResponseString);

                    var dateNow = Date.now();

                    var viewTransports = []; //Liste für Angezeigte Verbindungen
                    var lines = [];         //Zwischenspeicher für Linen

                    //Alle übergebenen Trasporte durchlaufen
                    for (var i = 0; i < rawTransports.length; i++) {

                        //Eimal pro Line und Richtung in die Liste packen
                        if($.inArray(rawTransports[i].number+rawTransports[i].direction, lines) == -1){
                            viewTransports.push(rawTransports[i])
                            //Und alle Verbindungen in den nächsten fünf Minuten
                            if(dateNow+300000 < new Date(rawTransports[i].time)){
                                lines.push(rawTransports[i].number+rawTransports[i].direction)
                            };
                        };
                    }
                    //Neu Laden
                    that.reset(viewTransports)
                    that.trigger('update');

                    if (options.success) {
                        options.success();
                    }
                }
            });
        },

        parseJourneyListResponse: function(xmlString) {
            var rawTransports = [];
            var xml = $(xmlString);

            xml.find('STBJourney').each(function(position, journeyNode) {
                journeyNode = $(journeyNode);
                var durationString = "P" + journeyNode.find('BasicStop Dep Time').text().replace('d', 'DT').replace(':', "H").replace(":", "M") + "S";
                var time = moment(journeyNode.find('Date').text(), "YYYYMMDD");
                time.add(moment.duration(durationString));
                rawTransports.push({
                    "stationName": journeyNode.find('BasicStop Station').attr('name'),
                    "stationExternalId": journeyNode.find('BasicStop Station').attr('externalId'),
                    "direction": journeyNode.find('Attribute[type=DIRECTION] AttributeVariant[type=NORMAL] Text').text(),
                    "name": journeyNode.find('Attribute[type=NAME] AttributeVariant[type=NORMAL] Text').text(),
                    "category": journeyNode.find('Attribute[type=CATEGORY] AttributeVariant[type=NORMAL] Text').text(),
                    "operatory": journeyNode.find('Attribute[type=OPERATOR] AttributeVariant[type=NORMAL] Text').text(),
                    "number": journeyNode.find('Attribute[type=NUMBER] AttributeVariant[type=NORMAL] Text').text(),
                    "platform":  journeyNode.find('BasicStop Dep Platform Text').text(),
                    "time":  time.toDate()
                });
            });

            return rawTransports;
        },

        rawCall: function(xmlString, callback) {
            $.ajax({
                type: "POST",
                url: config.get('transport_base_url'),
                crossDomain: true,
                data: '<?xml version="1.0" encoding="UTF-8" ?>\n' + xmlString,
                contentType: 'text/xml',
                dataType: 'xml',
                beforeSend: function (request) {
                    request.withCredentials = true;
                    request.setRequestHeader("Authorization", config.get('authorization'));
                }
            }).then(function(responseXml) {
                callback(false, responseXml);
            }).fail(function(responseXml) {
                callback(true, 'Invalid response');
            });
        }
    });

    return TransportCollection;
});