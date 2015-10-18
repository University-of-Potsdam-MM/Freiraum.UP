define('views/TransportCollectionView', ["jquery", "config", "views/BaseView", "collections/transports", "views/TransportView"], function ($, config, BaseView, transportsCollection, TransportView) {
    "use strict";

    var TransportCollectionView = BaseView.extend({

        initialize: function() {
            var that = this;

            this.listenTo(transportsCollection, "update", this.render);
            this.render();
        },

        render: function() {
            var that = this;

            var listBody = $(this.el).find('.js_journeys_tbody');
            var journeysHeadline = $(this.el).find('.js_journeys_headline');

            listBody.empty();

            transportsCollection.forEach(function(transport) {
                var view = new TransportView({"model": transport, "tagName": "tr"});
                listBody.append(view.render().el);
            });

            if (transportsCollection.length) {
                journeysHeadline.text('Nahverkehr');
            } else {
                journeysHeadline.text('Aktuell keine Zug- und Busverbindungen.');
            }
        }
    });

    return TransportCollectionView;
});


