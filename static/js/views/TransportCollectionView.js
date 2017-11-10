define('views/TransportCollectionView', ["jquery", "config", "views/BaseView", "collections/transports", "views/TransportView"], function ($, config, BaseView, transportsCollection, TransportView) {
    "use strict";

    var TransportCollectionView = BaseView.extend({

        initialize: function() {
            var that = this;

            this.listenTo(transportsCollection, "update", this.render);
            this.render();
        },

        render: function() {
            var listBody = $(this.el).find('.js_journeys_tbody');
            var journeysHeadline = $(this.el).find('.js_journeys_headline');

            listBody.empty();

            //console.log(transportsCollection);

            transportsCollection.forEach(function(transport) {
                var view = new TransportView({"model": transport});
                listBody.append(view.render().el);
            });

            if (transportsCollection.length) {
                journeysHeadline.text('Nahverkehrsverbindungen');
            } else {
                journeysHeadline.text('Aktuell keine Zug- und Busverbindungen.');
            }
        }
    });

    return TransportCollectionView;
});