define('views/AdView', ["jquery", "config", "views/BaseView"], function ($, config, BaseView) {
    "use strict";

    var AdView = BaseView.extend({

        initialize: function() {
            var that = this;
            this.currentIndex = 0;
            if (!config.get('ads')) throw new Error('Missing config.ads attribute for AdView');
            if (!config.get('ads_update_frequency')) throw new Error('Missing config.ads_update_frequency attribute for AdView');

            if (config.get('ads').length == 0) {
                $(this.el).addClass('is-hidden');
            } else {
                this.render();

                setInterval(function() {
                    that.currentIndex++;
                    if (that.currentIndex >= config.get('ads').length) {
                        that.currentIndex = 0;
                    }
                    that.render();
                }, config.get('ads_update_frequency') * 1000);
            }
        },

        render: function() {
            var that = this;
            var domElement = $(this.el);

            $.ajax({
                "url": config.get('ads')[that.currentIndex],
                "dataType": "html",
                "success": function(response) {
                    domElement.html(response);
                }
            });
        }
    });

    return AdView;
});


