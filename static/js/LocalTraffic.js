define('LocalTraffic', ['jquery', "json!../../config.json", "transportApi", 'moment'], function($, config, transportApi, moment) {

    var LocalTraffic = function(domElement, options) {
        var that = this;
        this.domElement = $(domElement);
        this.journeysHeadline = this.domElement.find('.js_journeys_headline');
        this.journeysTableBody = this.domElement.find('.js_journeys_tbody');
        this.refresh();
        setInterval(function() {
            that.refresh();
        }, config.transport_update_frequency * 1000);
    };

    LocalTraffic.prototype.refresh = function() {
        var that = this;

        transportApi.getTrainsForStation(config.station_id, function(error, journeys) {
            if (error) {
                jsb.fireEvent('LocalTraffic::NO_NEXT_JOURNEYS');
                that.journeysHeadline.text('Fehler: Nahverkehrsverbindungen können nicht ermittelt werden.');
                return ;
            }

            if (journeys.length == 0) {
                jsb.fireEvent('LocalTraffic::NO_NEXT_JOURNEYS');
                that.journeysHeadline.text('Aktuell keine Zug- und Busverbindungen.');
                return ;
            }

            jsb.fireEvent('LocalTraffic::NEXT_JOURNEYS', journeys);

            //that.journeysHeadline.text('Von: ' + journeys[0].getStationName());
            that.journeysHeadline.text('Nahverkehr');
            that.journeysTableBody.empty();
            journeys.forEach(function(journey) {
                var tr = $('<tr><td><strong class="js_journey_name"></strong></td><td><div><strong class="js_journey_direction"></strong></div><div class="js_journey_platform"></div></td><td class="text-right"><div><strong class="js_journey_time_absolute"></strong></div><div class="js_journey_time_relative"></div></td></tr>');
                tr.find('.js_journey_name').text(journey.getName());
                tr.find('.js_journey_direction').text(journey.getDirection());
                tr.find('.js_journey_time_absolute').text(journey.getTimeFormatted());
                tr.find('.js_journey_time_relative').text(journey.getTimeTo());
                if (journey.getPlatform()) {
                    tr.find('.js_journey_platform').text('Gleis ' + journey.getPlatform());
                } else {
                    tr.find('.js_journey_platform').text(journey.getPlatform());
                }


                that.journeysTableBody.append(tr);
            });

        });

    };
    //
    //LocalTraffic.prototype.getTrainsForStation = function(stationId, callback) {
    //    var xmlString = $($.parseHTML('<root><STBReq boardType="DEP" maxJourneys="5" sortOrder="REALTIME"><Time>23:00:52</Time><Today/><TableStation externalId="009230003#86"/><ProductFilter>1111111111111111</ProductFilter></STBReq></root>'));
    //    var xmlString = '<?xml version="1.0" encoding="UTF-8" ?>\n' + '<STBReq boardType="DEP" maxJourneys="5" sortOrder="REALTIME"><Time>' + moment().format('HH:mm:ss') + '</Time><Today/><TableStation externalId="' + stationId + '"/><ProductFilter>1111111111111111</ProductFilter></STBReq>';
    //    //xmlString.find('TableStation').attr('externalId', stationId);
    //    //xmlString.find('Time').text(moment().format('HH:mm:ss'));
    //    $.ajax({
    //        type: "POST",
    //        url: config.transport_base_url,
    //        crossDomain: true,
    //        //data: '<?xml version="1.0" encoding="UTF-8" ?>\n' + xmlString.html(),
    //        data: xmlString,
    //        contentType: 'text/xml',
    //        dataType: 'xml',
    //        beforeSend: function (request) {
    //            request.withCredentials = true;
    //            request.setRequestHeader("Authorization", config.authorization);
    //        }
    //    });
    //};

    return LocalTraffic;
});