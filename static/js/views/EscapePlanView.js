define('views/EscapePlanView', ["Backbone", "config", "jquery", "views/BaseView"], function (Backbone, config, $, BaseView) {
    "use strict";

    var EscapePlanView = BaseView.extend({

        initialize: function(options) {

            $(window).on("resize",this.scaleView)
            if (!config.get('house')) throw new Error('Missing config.house attribute for EscapePlanView');
            if (!config.get('campus')) throw new Error('Missing config.campus attribute for EscapePlanView');

            this.render();
        },

        render: function() {

            var content = $(this.el).find('.js_escape_body');

            content.empty();

            content.html('<img src="static/img/plans/'+ config.get('campus') +'-'+ config.get('house') + '-'+ config.get('level') + '.png" class="img-responsive center-block">');

            BaseView.prototype.scaleView()
            return this;
        }
    });

    return EscapePlanView;
});