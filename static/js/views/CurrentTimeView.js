define('views/CurrentTimeView', ['jquery', "config", "moment", "bandClock", "views/BaseView"], function($, config, moment, bandClock, BaseView) {

    var CurrentTimeView = BaseView.extend({
        initialize: function() {
            var that = this;
            that.render();
        },

        render: function() {
            $('.bandClock').bandClock({
              //configure here
              size: 125,
              strokeColor: '#fff', 
              bgColor: '#d0dae3',
              color: '#014260' ,
              lineCap: 2,
              gap: 0,
              fontStyle: '32px Helvetica Neue, Helvetica, Arial, sans-serif'
            });
        }
    });

    return CurrentTimeView;
});