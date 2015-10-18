define('views/BaseView', ["Backbone"], function (Backbone) {
    "use strict";

    var BaseView = Backbone.View.extend({

        constructor: function(domElement, options) {
            options = options || {};

            /*
             * jsb erwartet domElement+options, Backbone erwartet nur options mit options.el = DomElement
             * Dieser Workaround ist nötig, damit wir die Views einfach mit JSB einbinden können.
             */
            if (domElement instanceof Node) {
                options.el = domElement;
            } else {
                options = domElement || {};
            }
            Backbone.View.apply(this, [options]);
        }
    });

    return BaseView;
});


