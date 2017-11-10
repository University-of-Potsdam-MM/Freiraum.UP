define('views/TransportView', ["Backbone", "config", "jquery", "moment"], function (Backbone, config, $, moment) {
    "use strict";

    var TransportView = Backbone.View.extend({

        tagName: "tr",

        initialize: function(options) {
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            var that = this;
            var tr = $(this.el);

            // some styling of table rows
            // category has to be trimmed, API delivering things like "RB     "
            if (this.model.get('Product')['catOut'].trim() == "RB"){
                tr.addClass("danger");
            }else if(this.model.get('Product')['catOut'].trim() == "S"){
                tr.addClass("success");
            }else{
                tr.addClass("active");
            }
            tr.html('<td class="js_journey_name vert-align"></td><td class="journey_dir_platf vert-align"><p class="js_journey_direction vert-align"></p></td><td class="js_journey_time_relative vert-align"></td>');

            tr.find('.js_journey_name').text(that.model.get('name'));
            tr.find('.js_journey_name').addClass(that.model.get('Product')['catOut']);
            tr.find('.js_journey_direction').text(that.model.get('direction'));

            // calculate the difference from currentTime and the deparingTime
            // FIXME: Extract to model
            var currentTime= moment().format('HH:mm:ss');
            var depTime = moment(that.model.get('time'), 'HH:mm:ss');
            var difference = moment().to(moment(depTime), 'HH:mm:ss');

            tr.find('.js_journey_time_relative').text(difference);

            return this;
        }
    });

    return TransportView;
});