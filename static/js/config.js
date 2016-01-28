define('config', ["Backbone"], function (Backbone) {
    "use strict";

    var Config = Backbone.Model.extend({

        url: 'config.json',

        initialize: function () {
            var that = this;
            this.fetch({async:false});

            if (!this.get('now')) {
                this.set('now', new Date().toUTCString());
            }

            if (typeof this.force_page === "undefined") {
                this.set('force_page', null);
            }

            this.refreshTime();

            setInterval(function() {
                that.refreshTime();
            }, that.get('rooms_update_frequency') * 1000);
        },

        refreshTime: function(){
            console.log('update triggered');
            console.log(this);
            var now = new Date(this.get('now'));
            now.setHours(Math.floor(now.getHours() / 2) * 2);
            now.setMinutes(0);
            now.setSeconds(0);
            this.set('now', now);

            var soon = new Date();
            soon.setTime(this.get('now').getTime() + 2 * 60 * 60 * 1000)
            this.set('soon', soon);
        }

    });


    return new Config;
});