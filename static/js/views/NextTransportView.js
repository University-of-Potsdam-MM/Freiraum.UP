define('views/NextTransportView', ["jquery", "config", "views/BaseView", "collections/transports", "moment"], function ($, config, BaseView, transportsCollection, moment) {
    "use strict";

    var NextTransportView = BaseView.extend({

        initialize: function() {
            var that = this;

            this.listenTo(transportsCollection, "update", this.render);
            this.render();
        },

        render: function() {
            var that = this;

            var journeysText = [];
            var firstForCategoryMap = {};
            var now = (new Date()).getTime();
            transportsCollection.forEach(function(transport) {
                if (transport.getTime() < now + 60000) {
                    /* Zeige nur ÖPNV in wenigstens einer Sekunde */
                    return ;
                }
                if (!firstForCategoryMap[transport.getName()]) {
                    firstForCategoryMap[transport.getName()] = transport;
                }
            });

            var count = 0;

            for (var name in firstForCategoryMap) {
                if (firstForCategoryMap.hasOwnProperty(name)) {
                    if (count < config.get('local_traffic_count')) {
                        count++;
                        journeysText.push(name + ' ' + moment().to(firstForCategoryMap[name].getTime()));
                    }
                }
            }

            $(this.el).text(journeysText.join(', '));
        }
    });

    return NextTransportView;
});


