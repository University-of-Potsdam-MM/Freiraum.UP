define('PageSwitcher', ['jquery', "json!../../config.json", "moment"], function($, config, moment) {

    var PageSwitcher = function(domElement, options) {
        var that = this;
        this.domElement = $(domElement);

        var current_page = 0;
        var waiting_time = config.switch_page_frequency;
        var max_progress = waiting_time;
        var new_page_in = waiting_time;

        this.pages = this.domElement.find('.js_page');
        this.pages.hide();
        $(this.pages[0]).show();

        var toNextPage = function() {
            new_page_in--;
            if (new_page_in == 0)
            {
                $(that.pages[current_page]).hide();

                /* Remember this, in case every page would be hidden. */
                var initial_current_page = current_page;

                do {
                    current_page = current_page + 1;
                    console.log('FINDING NEXT PAGE for', initial_current_page, ' and testing ', current_page);
                    if (that.pages.length == current_page)
                    {
                        current_page = 0;
                    }

                } while ($(that.pages[current_page]).hasClass('is-hidden') && initial_current_page !== current_page);

                console.log('NEXT PAGE after', initial_current_page, 'is now', current_page);

                $(that.pages[current_page]).show();

                new_page_in = max_progress;
                that.domElement.find('.js_progress_bar').css('width', 0);
            }
            else
            {
                that.domElement.find('.js_progress_bar').css('width', Math.floor(100 - 100 * (new_page_in / max_progress)) + '%');
            }
        };

        setInterval(toNextPage, (waiting_time / max_progress) * 1000);
    };

    return PageSwitcher;
});