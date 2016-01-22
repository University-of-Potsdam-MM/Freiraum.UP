define('views/NightSwitchView', ["jquery", "config", "views/BaseView", "moment"], function ($, config, BaseView, moment) {
    "use strict";

    var NightSwitchView = BaseView.extend({

        initialize: function() {
            var that = this;

            if (!config.get('switch_on_at')) throw new Error('Missing config.switch_on_at attribute for NightSwitchView');
            if (!config.get('switch_off_at')) throw new Error('Missing config.switch_off_at attribute for NightSwitchView');

            setInterval(function() {
                that.render();
            }, 60000);

            that.render();
        },

        render: function() {
            var that = this;

            var switchOnAt = moment(config.get('switch_on_at'), 'HH:mm').unix();
            var switchOffAt = moment(config.get('switch_off_at'), 'HH:mm').unix();
            var now = moment().unix();

            if (switchOnAt <= now && switchOffAt > now && switchOffAt > switchOnAt) {
                /* soll tagsüber an sein: 06:00 <= 12:30 && 22:00 > 12:30 && 22:00 > 06:00 */
                that.switchOn();
            } else if (switchOnAt >= now && switchOffAt < now && switchOffAt < switchOnAt) {
                /* soll nachts an sein: 23:00 >= 22:00 && 06:00 < 23:00 && 06:00 < 22:00 */
                that.switchOn();
            } else {
                that.switchOff();
            }
        },

        switchOn: function() {
            var domElement = $(this.el);
            domElement.removeClass('is-switched-off');
        },

        switchOff: function() {
            var domElement = $(this.el);
            if (!domElement.hasClass('is-switched-off')) {
                domElement.addClass('is-switched-off');
            }
        }

    });

    return NightSwitchView;
});


