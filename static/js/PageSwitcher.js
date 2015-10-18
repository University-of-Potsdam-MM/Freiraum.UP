define('PageSwitcher', ['jquery', "config", "moment"], function($, config, moment) {

    var PageSwitcher = function(domElement, options) {
        var that = this;
        this.domElement = $(domElement);

        var current_page = 0;
        var waiting_time = config.get('switch_page_frequency');
        var max_progress = waiting_time;
        var new_page_in = waiting_time;

        this.pages = this.domElement.find('.js_page');
        this.pages.hide();

        $('.js_app_title').text('Campus ' + config.get('campus') + ', Haus ' + config.get('house'));
        document.title = $('.js_app_title').text();

        var force_page_match = document.location.toString().match(/page=([^&$]+)/);
        if (force_page_match)
        {
            current_page = parseInt(decodeURIComponent(force_page_match[1]), 10);
        }

        $(this.pages[current_page]).show();

        var toNextPage = function() {
            new_page_in--;
            if (new_page_in == -1)
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

        if (!force_page_match) {
            setInterval(toNextPage, (waiting_time / max_progress) * 1000);
        }

        this.current_time_element = this.domElement.find('.js_current_time');
        setInterval(function() {
            var currentTimeString = moment().format('HH:mm:ss');

            if (that.current_time_element.text() != currentTimeString) {
                that.current_time_element.text(currentTimeString);
            }
        }, 1000);
    };

    return PageSwitcher;
});