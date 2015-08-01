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

        jsb.on('LocalTraffic::NEXT_JOURNEYS', function(journeys) {

            var journeysText = [];
            var firstForCategoryMap = {};
            var now = (new Date()).getTime();
            journeys.forEach(function(journey) {
                if (journey.getTime() < now + 60000) {
                    /* Zeige nur ÖPNV in wenigstens einer Sekunde */
                    return ;
                }
                if (!firstForCategoryMap[journey.getName()]) {
                    firstForCategoryMap[journey.getName()] = journey;
                }
            });

            var count = 0;

            for (var name in firstForCategoryMap) {
                if (firstForCategoryMap.hasOwnProperty(name)) {
                    if (count < config.local_traffic_count) {
                        count++;
                        journeysText.push(name + ' ' + moment().to(firstForCategoryMap[name].getTime()));
                    }
                }
            }

            $('.js_next_local_traffic').text(journeysText.join(', '));
        });

        jsb.on('LocalTraffic::NO_NEXT_JOURNEYS', function() {
            $('.js_next_local_traffic').text('');
        });
    };

    return PageSwitcher;
});