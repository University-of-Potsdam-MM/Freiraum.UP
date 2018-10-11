define('config', ["Backbone"], function (Backbone) {
    "use strict";

    var Ads = Backbone.Model.extend({
        url: 'ads.json',

        initialize: function () {
            var that = this;
            this.fetch({
                async:false,
                success: function(c, r, o){
                    //console.log(c, r, o);
                },
                error: function(c, r, o){
                    console.log(c,r,o);
                }
            });
        }
    });

    var Config = Backbone.Model.extend({

        url: 'config.json',

        initialize: function () {
            var that = this;
            var ads = new Ads();
            that.set('ads', ads.get('ads'));

            this.fetch({
                async:false,
                success: function(c, r, o){
                    //console.log(c, r, o);
                },
                error: function(c, r, o){
                    console.log(c,r,o);
                }
            });

            this.refreshTime();

            // trigger update every 15 minutes
            // when tillNextUpdate is changed next update necessary
            function everyQuarter() {
                //console.log('triggered');
                var d = new Date(),
                    h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), (d.getMinutes() - (d.getMinutes() % 15)) + 15, 0, 0),
                    e = h - d;
                //console.log(that);
                that.set('tillNextUpdate', e);
                //console.log('saved');
                window.setTimeout(everyQuarter, e);

                //console.log('run', e);
            }

            everyQuarter();

            // updating current time every secound
            setInterval(function() {
                that.refreshTime();
            }, 1000);
        },

        refreshTime: function(){

            var now = new Date();
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