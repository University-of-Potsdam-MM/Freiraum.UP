define('views/AdView',
    [
        "jquery",
        "config",
        "moment",
        "views/BaseView"
    ],
function ($, config, moment, BaseView) {

    "use strict";

    var AdView = BaseView.extend({

        initialize: function(options) {
            if (!config.get('ads')) throw new Error('Missing config.ads attribute for AdView');

            var that = this;
            this.currentIndex = (options) ? options.index : 0;
            this.counter = 0;

            // filters relevant items for ads slot (no timestamp or valid timestamps)
            //console.log(config.get('ads')[this.currentIndex]);
            this.data = config.get('ads')[this.currentIndex].filter(function(ads) {
                //console.log(ads);
                var startTime = ads.startTime;
                var endTime = ads.endTime;

                if (startTime && endTime){
                    startTime = moment(startTime).format();
                    endTime = moment(endTime).format();
                }

                return (!ads.startTime || moment().isBetween(ads.startTime, ads.endTime));
            });
            //console.log(this.data);

            if (this.data.length == 0) {
                $(this.el).addClass('is-hidden');
            }

            jsb.whenFired('PageSwitcherView::SHOW_PAGE', function(values) {
                if (that.currentIndex === values.id && that.data.length != 0) {
                    that.counter++;
                    that.render();
                } else {
                    $(that.el).empty();
                }
            });

        },

        render: function() {
            var that = this;
            var domElement = $(this.el);

            // get current object in list
            //console.log(that.counter-1, that.data.length);
            that.iterator = (that.counter-1) % that.data.length;
            //console.log(that.iterator, that.data[that.iterator].url);

            $.ajax({
                "url": that.data[that.iterator].url,
                "dataType": "html",
                "success": function(response) {
                    domElement.html(response);

                    var refreshMetaTag = $(domElement).find('meta[name=next-page-in]');
                    if (refreshMetaTag) {
                        jsb.fireEvent('PageSwitcherView::SHOW_NEW_PAGE_IN', {
                            "seconds": parseInt(refreshMetaTag.attr('content'), 10)
                        });
                    }
                }
            });
        }
    });

    return AdView;
});