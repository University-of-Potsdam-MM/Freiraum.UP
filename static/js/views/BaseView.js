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
        },

        scaleView: function(){
            /*
             * skaliert Neuigkeiten und Veranstaltungen, so dass diese entsprechend Platz des Containers haben
             * und diesen zu gleichen Teilen vereinnehmen
             */
            var comp_height= ($("body").height() - $(".free-rooms").outerHeight() - 250)/2;
            $(".row-fluid").css("height", comp_height+'px');
        }
    });

    return BaseView;
});