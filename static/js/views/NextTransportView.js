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

            var journeysText = '';
            var firstForCategoryMap = {};
            var now = (new Date()).getTime();

            $(this.el).empty();

            transportsCollection.each(function(transport) {
                if (transport.get('time') < now + 60000) {
                    /* Zeige nur ÖPNV in wenigstens einer Sekunde */
                    return ;
                }
                if (!firstForCategoryMap[transport.get('name')]) {
                    firstForCategoryMap[transport.get('name')] = transport;
                }
            });

            var count = 0;

            for (var name in firstForCategoryMap) {
                if (firstForCategoryMap.hasOwnProperty(name)) {
                    if (count < config.get('local_traffic_count')) {
                        count++;
                        journeysText += '<button class="btn btn-primary btn-xlarge" type="button">' + name + '<span class="badge">' + moment().to(firstForCategoryMap[name].get('time')) + '</span></button>';
                    }
                }
            }

            $(this.el).append('<h2>' + journeysText + '</h2>');
        }
    });

    return NextTransportView;
});