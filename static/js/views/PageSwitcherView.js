define('views/PageSwitcherView', ['jquery', "config", "moment", "views/BaseView"], function($, config, moment, BaseView) {

    var PageSwitcherView = BaseView.extend({
        initialize: function() {
            var that = this;

            this.current_page = config.get('force_page') || 0;
            this.waiting_time = config.get('switch_page_frequency');
            this.max_progress = config.get('switch_page_frequency');
            this.new_page_in = config.get('switch_page_frequency');

            this.pages = $(this.el).find('.js_page');
            this.pages.hide();

            $('.js_app_title').text('Campus ' + config.get('campus') + ', Haus ' + config.get('house'));
            document.title = $('.js_app_title').text();

            $(this.pages[this.current_page]).show();

            if (config.get('force_page') === null) {
                setInterval(function() {
                    that.showNextPage();
                }, (this.waiting_time / this.max_progress) * 1000);
            }
        },

        showNextPage: function() {
            this.new_page_in--;
            if (this.new_page_in == -1)
            {
                $(this.pages[this.current_page]).hide();

                /* Remember this, in case every page would be hidden. */
                var initial_current_page = this.current_page;

                do {
                    this.current_page = this.current_page + 1;
                    console.log('FINDING NEXT PAGE for', initial_current_page, ' and testing ', this.current_page);
                    if (this.pages.length == this.current_page)
                    {
                        this.current_page = 0;
                    }

                } while ($(this.pages[this.current_page]).hasClass('is-hidden') && initial_current_page !== this.current_page);

                console.log('NEXT PAGE after', initial_current_page, 'is now', this.current_page);

                $(this.pages[this.current_page]).show();

                this.new_page_in = this.max_progress;
            }

            this.render();
        },

        render: function() {
            $(this.el).find('.js_progress_bar').css('width', Math.floor(100 - 100 * (this.new_page_in / this.max_progress)) + '%');
        }
    });

    return PageSwitcherView;
});