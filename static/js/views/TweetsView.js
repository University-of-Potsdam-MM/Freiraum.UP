define('views/TweetsView', ["jquery", "config", "views/BaseView"], function ($, config, BaseView) {
    "use strict";

    var TweetsView = BaseView.extend({

        initialize: function() {
            var that = this;

            this.render();
        },

        render: function() {
            var that = this;
            var domElement = $(this.el);

            domElement.find('.js_twitter_timeline').attr('data-widget-id', config.get('twitter_widget_id'));
            if (!document.getElementById('twitter-wjs')) {
                !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
            }
        }
    });

    return TweetsView;
});


