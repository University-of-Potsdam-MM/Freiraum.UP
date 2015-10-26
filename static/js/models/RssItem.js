define('models/RssItem', ["Backbone", "jquery", "moment"], function (Backbone, $, moment) {
    "use strict";

    var RssItem = Backbone.Model.extend({

        getTitle: function() {
            return this.get('title');
        },
    
        getContent: function() {
            return this.get('content');
        },
    
        getImageSrc: function() {
            return this.get('imageSrc');
        },
    
        getPublishedTimestamp: function() {
            return this.get('publishedTimestamp');
        },
    
        getUpdatedTimestamp: function() {
            return this.get('updatedTimestamp');
        },
    
        hasLocation: function() {
            return this.getContent().match(/^(.+), (.+) - /) ? true : false;
        },
    
        getMainLocation: function() {
            var match = this.getContent().match(/^(.+?), (.+?) - /);
            return match && match[1];
        },
    
        getLocation: function() {
            var match = this.getContent().match(/^(.+?), (.+?) - /);
            return match && match[2];
        }
    });

    return RssItem;
});