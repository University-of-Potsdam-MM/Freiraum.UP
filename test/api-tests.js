'use strict';
var requirejs = require("requirejs");
var assert = require("chai").assert;
var domino = require('domino');
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
            requirejs(
                [
                    'collections/freeRooms',
                    'collections/bookedRooms',
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
