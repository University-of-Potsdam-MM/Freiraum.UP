'use strict';
var assert = require("chai").assert;

/*
 * Der nächste Abschnitt ist dafür da, dass die nodejs-Umgebung so wirkt, wie wie einen Browser:
 */
var requirejs = require("requirejs");
var domino = require('domino');
global.DOMParser = require('xmldom').DOMParser;
var window = domino.createWindow();
global.jQuery = require('jquery')(window);
global.$ = global.jQuery;
global.window = window;
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
        'underscoreString': './../bower_components/underscore.string/dist/underscore.string',
        'jquery': '../bower_components/jquery/jquery',
        'json': '../bower_components/requirejs-plugins/src/json',
        'text': '../bower_components/requirejs-plugins/lib/text'
    }
});

/*
 * Initialisieren von moment.js und den pre-require'ten modules, welche gleich getestet werden.
 *
 * Außerdem werden ein paar der Konfigvariablen spezifisch für den Test gesetzt.
 */
before(function(done) {
    requirejs(
        [
            'config',
            'moment'
        ],
        function(config, moment) {

            /*
             * wir testen immer am nächsten Montag um 10:00 Uhr
             */
            var nextMondayAtTen = moment();
            nextMondayAtTen.day(1);
            nextMondayAtTen.hour(10);
            nextMondayAtTen.minute(0);
            nextMondayAtTen.second(0);

            config.set('now', new Date(nextMondayAtTen.format()));

            /*
             * wir testen immer mit den echten RSS-Feed URLs, weil wir kein CROSS-Origin-Problem auf der CLI haben
             */
            config.set('events_rss_feed_url', 'https://www.uni-potsdam.de/veranstaltungen/rss-feed-abonnieren/eventfeed/feed/xml.html?tx_upevents_upeventfeed%5Blimit%5D=30&tx_upevents_upeventfeed%5Bcat%5D=&tx_upevents_upeventfeed%5BcatLink%5D=or');
            config.set('news_rss_feed_url', 'http://www.uni-potsdam.de/nachrichten/rss-feed-abonnieren.html?type=100&tx_ttnews%5Bcat%5D=19');

            /*
             * wir benötigen die folgenden Module für die Tests
             */
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
                    /*
                     * alle module sind geladen -> die Tests können starten!
                     */
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
        this.timeout(20000); /* dieses feed ist wirklich sehr langsam */
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
        this.timeout(20000); /* dieses feed ist wirklich sehr langsam */
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