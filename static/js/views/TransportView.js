define('views/TransportView', ["Backbone", "config", "jquery"], function (Backbone, config, $) {
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
            if (this.model.get('category') == "RB"){
                this.el.className = "danger";
            }else if(this.model.get('category') == "S"){
                this.el.className = "success";
            }else{
                this.el.className = "active";
            }

            tr.html('<td class="js_journey_name vert-align"></td><td class="journey_dir_platf vert-align"><p class="js_journey_direction vert-align"></p></td><td class="js_journey_time_relative vert-align"></td>');
            
            tr.find('.js_journey_name').text(that.model.get('name'));
            tr.find('.js_journey_name').addClass(that.model.get('category'));
            tr.find('.js_journey_direction').text(that.model.get('direction'));
            tr.find('.js_journey_time_relative').text(that.model.get('TimeTo'));

            return this;
        }
    });

    return TransportView;
});