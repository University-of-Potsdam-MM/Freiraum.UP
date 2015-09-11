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
                var tr = $('<tr><td class="js_journey_name"></td><td class="journey_dir_platf"><p class="js_journey_direction"></p><p class="js_journey_platform"></p></td><td class="js_journey_time_absolute"></td><td class="js_journey_time_relative"></td></tr>');
                tr.find('.js_journey_name').text(journey.getName());
                tr.find('.js_journey_name').addClass(journey.getCategory());
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

    return LocalTraffic;
});