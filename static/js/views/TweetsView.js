define('views/TweetsView', ["jquery", "config", "views/BaseView"], function ($, config, BaseView) {
    "use strict";

    var TweetsView = BaseView.extend({

        initialize: function() {
            /*
             * ToDo: Load String from Config
             */
            this.render();
        },

        render: function() {

        }
    });

    return TweetsView;
});