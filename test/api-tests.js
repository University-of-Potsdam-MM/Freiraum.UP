'use strict';
var requirejs = require("requirejs");
var assert = require("chai").assert;
var domino = require('domino');
global.DOMParser = require('xmldom').DOMParser;
global.jQuery = require('jquery')(domino.createWindow());
global.$ = global.jQuery;
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
$.support.cors=true; // cross domain
$.ajaxSettings.xhr = function() {
    return new global.XMLHttpRequest();
};

requirejs.define('jquery', function() {
    return jQuery;
});

requirejs.config({
    baseUrl: 'static/js',
    nodeRequire: require,
    paths: {
        'jsb': '../bower_components/jsb/jsb',
        'moment': '../bower_components/moment/moment',
        'Backbone': '../bower_components/backbone/backbone',
        'underscore': '../bower_components/underscore/underscore',
        'jquery': '../bower_components/jquery/jquery',
        'json': '../bower_components/requirejs-plugins/src/json',
        'text': '../bower_components/requirejs-plugins/lib/text'
    }
});

before(function(done) {
    requirejs(
        [
            'config',
            'moment'
        ],
        function(config, moment) {
            config.set('house', 6);

            var nextMondayAtTen = moment();
            nextMondayAtTen.day(1);
            nextMondayAtTen.hour(10);
            nextMondayAtTen.minute(0);
            nextMondayAtTen.second(0);

            config.set('now', new Date(nextMondayAtTen.format()));
            config.set('events_rss_feed_url', 'https://www.uni-potsdam.de/veranstaltungen/rss-feed-abonnieren/eventfeed/feed/xml.html?tx_upevents_upeventfeed%5Blimit%5D=30&tx_upevents_upeventfeed%5Bcat%5D=&tx_upevents_upeventfeed%5BcatLink%5D=or');
            config.set('news_rss_feed_url', 'http://www.uni-potsdam.de/nachrichten/rss-feed-abonnieren.html?type=100&tx_ttnews%5Bcat%5D=19');
            requirejs(
                [
                    'collections/freeRooms',
                    'collections/bookedRooms',
                    'collections/events',
                    'collections/news',
                    'collections/transports',
                    'jquery'
                ],
                function () {
                    done();
                }
            );
        }
    );
});

describe('collections/bookedRooms', function() {
    it('should contain all booked rooms', function(done) {
        var bookedRooms = requirejs('collections/bookedRooms');
        bookedRooms.fetch({
            "success": function() {
                assert.ok(bookedRooms.length > 0);
                done();
            },
            "error": function() {
                throw new Error('cannot retrieve the booked rooms');
                done();
            }
        });
    });
});


describe('collections/freeRooms', function() {
    it('should contain all free rooms', function(done) {
        var freeRooms = requirejs('collections/freeRooms');
        freeRooms.fetch({
            "success": function() {
                assert.ok(freeRooms.length > 0);
                done();
            },
            "error": function() {
                throw new Error('cannot retrieve the free rooms');
                done();
            }
        });
    });
});

describe('collections/transports', function() {
    it('should contain all transport connections', function(done) {
        var transports = requirejs('collections/transports');
        transports.fetch({
            "success": function() {
                assert.ok(transports.length > 0);
                done();
            },
            "error": function() {
                throw new Error('cannot retrieve the transports');
                done();
            }
        });
    });
});

describe('collections/events', function() {
    it('should contain all events', function(done) {
        this.timeout(10000); /* dieses feed ist wirklich sehr langsam */
        var events = requirejs('collections/events');
        events.fetch({
            "success": function() {
                assert.ok(events.length > 0);
                done();
            },
            "error": function() {
                throw new Error('cannot retrieve the events');
                done();
            }
        });
    });
});


describe('collections/news', function() {
    it('should contain all news', function(done) {
        this.timeout(10000); /* dieses feed ist wirklich sehr langsam */
        var news = requirejs('collections/news');
        news.fetch({
            "success": function() {
                assert.ok(news.length > 0);
                done();
            },
            "error": function() {
                throw new Error('cannot retrieve the news');
                done();
            }
        });
    });
});