define('transportApi', ['jquery', "json!../../config.json", "moment", "domain/Journey"], function($, config, moment, Journey) {

    var TransportApi = function() {
    };


    TransportApi.prototype.getTrainsForStation = function(stationId, callback) {
        var that = this;
        var xmlString = '<STBReq boardType="DEP" maxJourneys="20" sortOrder="REALTIME"><Time>' + moment().format('HH:mm:ss') + '</Time><Today/><TableStation externalId="' + stationId + '"/><ProductFilter>1111111111111111</ProductFilter></STBReq>';
        this.rawCall(xmlString, function(error, xmlResponseString) {
            if (error) {
                callback(error, xmlResponseString);
            } else {
                callback(error, that.parseJourneyListResponse(xmlResponseString));
            }
        });
    };

    TransportApi.prototype.parseJourneyListResponse = function(xmlString) {
        var journeys = [];
        var xml = $(xmlString);


        xml.find('STBJourney').each(function(position, journeyNode) {
            journeyNode = $(journeyNode);
            var durationString = "P" + journeyNode.find('BasicStop Dep Time').text().replace('d', 'DT').replace(':', "H").replace(":", "M") + "S";
            var time = moment(journeyNode.find('Date').text(), "YYYYMMDD");
            time.add(moment.duration(durationString));
            journeys.push(new Journey({
                "stationName": journeyNode.find('BasicStop Station').attr('name'),
                "stationExternalId": journeyNode.find('BasicStop Station').attr('externalId'),
                "direction": journeyNode.find('Attribute[type=DIRECTION] AttributeVariant[type=NORMAL] Text').text(),
                "name": journeyNode.find('Attribute[type=NAME] AttributeVariant[type=NORMAL] Text').text(),
                "category": journeyNode.find('Attribute[type=CATEGORY] AttributeVariant[type=NORMAL] Text').text(),
                "operatory": journeyNode.find('Attribute[type=OPERATOR] AttributeVariant[type=NORMAL] Text').text(),
                "number": journeyNode.find('Attribute[type=NUMBER] AttributeVariant[type=NORMAL] Text').text(),
                "platform":  journeyNode.find('BasicStop Dep Platform Text').text(),
                "time":  time.toDate()
            }));
        });

        return journeys;
    };

    TransportApi.prototype.rawCall = function(xmlString, callback) {
        console.log('TransportApi:rawCall', xmlString.substr(0, 255));
        $.ajax({
            type: "POST",
            url: config.transport_base_url,
            crossDomain: true,
            //data: '<?xml version="1.0" encoding="UTF-8" ?>\n' + xmlString.html(),
            data: '<?xml version="1.0" encoding="UTF-8" ?>\n' + xmlString,
            contentType: 'text/xml',
            dataType: 'xml',
            beforeSend: function (request) {
                request.withCredentials = true;
                request.setRequestHeader("Authorization", config.authorization);
            }
        }).then(function(responseXml) {
            callback(false, responseXml);
        }).fail(function(responseXml) {
            callback(true, 'Invalid response');
        });
    };

    return new TransportApi();
});