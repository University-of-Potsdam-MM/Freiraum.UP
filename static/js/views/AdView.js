define('views/AdView', ["jquery", "config", "views/BaseView"], function ($, config, BaseView) {
    "use strict";

    var AdView = BaseView.extend({

        initialize: function() {
            var that = this;
            this.currentIndex = 0;
            if (!config.get('ads')) throw new Error('Missing config.ads attribute for AdView');

            if (config.get('ads').length == 0) {
                $(this.el).addClass('is-hidden');
            }

            jsb.whenFired('PageSwitcherView::SHOW_PAGE', function(values) {
                if (values.id === 'ad-view') {
                    that.render();
                } else {
                    $(that.el).empty();
                }
            });
        },

        render: function() {
            var that = this;
            var domElement = $(this.el);

            $.ajax({
                "url": config.get('ads')[that.currentIndex],
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


