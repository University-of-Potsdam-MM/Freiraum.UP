define('views/NewsView', ["Backbone", "config", "jquery", "moment"], function (Backbone, config, $, moment) {
    "use strict";

    var NewsView = Backbone.View.extend({

        tagName: "tr",

        initialize: function(options) {
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            var that = this;
            var tr = $(this.el);

            tr.html('<td class="news-td" colspan="2"><div class="news-title">Das ist der Titel</div></td>');
            tr.find('td').css('background-image', 'url(\'' + this.model.get('imageSrc') + '\')');
            tr.find('.news-title').text(this.model.get('title') + ' (' + moment(this.model.get('publishedTimestamp')).format('DD.MM.YYYY') + ')');

            return this;
        }
    });

    return NewsView;
});