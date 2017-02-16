define('views/CurrentTimeView', ['jquery', "config", "moment", "views/BaseView"], function($, config, moment, BaseView) {

    var CurrentTimeView = BaseView.extend({
        initialize: function() {
            var that = this;
            that.render();
            
            // updating current time every secound
            setInterval(function() {
                config.refreshTime();
                that.render();
            }, 1000);
        },

        render: function() {
            var currentTimeString = moment().format('HH:mm');

            if ($(this.el).text() != currentTimeString) {
                $(this.el).text(currentTimeString);
            }
        }
    });

    return CurrentTimeView;
});