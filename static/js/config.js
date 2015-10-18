define('config', ["json!../../config.json", "Backbone"], function (rawConfig, Backbone) {
    "use strict";

    var Config = Backbone.Model.extend({
        initialize: function () {
        }
    });

    if (typeof document !== "undefined") {
        var house_match = document.location.toString().match(/house=([^&$]+)/);
        if (house_match)
        {
            rawConfig.house = decodeURIComponent(house_match[1]);
        }
        var campus_match = document.location.toString().match(/campus=([^&$]+)/);
        if (campus_match)
        {
            rawConfig.campus = decodeURIComponent(campus_match[1]);
        }

        var now_match = document.location.toString().match(/now=([^&$]+)/);
        if (now_match)
        {
            rawConfig.now = new Date(decodeURIComponent(now_match[1]));
        }
    }

    if (!rawConfig.now) {
        rawConfig.now = (new Date()).toUTCString();
    }

    rawConfig.now = new Date(rawConfig.now);
    rawConfig.now.setHours(Math.floor(rawConfig.now.getHours() / 2) * 2);
    rawConfig.now.setMinutes(0);

    rawConfig.soon = new Date();
    rawConfig.soon.setTime(rawConfig.now.getTime() + 2 * 60 * 60 * 1000);

    return new Config(rawConfig);
});