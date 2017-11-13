define('views/NextTransportView', ["jquery", "config", "views/BaseView", "collections/transports", "moment"], function ($, config, BaseView, transportsCollection, moment) {
    "use strict";

    var NextTransportView = BaseView.extend({

        initialize: function() {
            this.listenTo(transportsCollection, "update", this.render);
            this.render();
        },

        render: function() {
            var journeysText = '';
            var firstForCategoryMap = {};
            var now = (new Date()).getTime();

            $(this.el).empty();

            transportsCollection.each(function(transport) {
                if (transport.get('time') < now + 60000) {
                    /* Zeige nur ÖPNV in wenigstens einer Sekunde */
                    return ;
                }
                if (!firstForCategoryMap[transport.get('direction')]) {
                    firstForCategoryMap[transport.get('direction')] = transport;
                }
            });
            var count = 0;
            _.sortBy(firstForCategoryMap, 'time');

            for (var direction in firstForCategoryMap) {
                if (firstForCategoryMap.hasOwnProperty(direction)) {
                    if (count < config.get('transport_local_traffic_count')) {
                        count++;
                        var name = firstForCategoryMap[direction].get('name');
                        var timeTo = moment().to(moment(firstForCategoryMap[direction].get('time'), 'HH:mm:ss'));
                        journeysText += '<button class="btn btn-primary btn-xlarge" type="button">' + name + '<span class="badge">' + timeTo + '</span></button>';
                    }
                }
            }
            $(this.el).append("<h2>" + journeysText + "</h2>");
        }
    });

    return NextTransportView;
});