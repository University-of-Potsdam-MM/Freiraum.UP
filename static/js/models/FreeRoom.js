define('models/FreeRoom', ["Backbone", "jquery", "moment"], function (Backbone, $, moment) {
    "use strict";

    var FreeRoom = Backbone.Model.extend({

		defaults: {
			campus: null,
			house: null,
			room: null
		},

        parse: function(response){
        	var room_match = response.match(/^([^\.]+)\.([^\.]+)\.(.+)/);

            if (room_match) {
            	return {
	                campus: room_match[1],
	                house: parseInt(room_match[2], 10),
	                room: room_match[3]
	        	}
            }else{
            	return null;
            }
		}
    });

    return FreeRoom;
});