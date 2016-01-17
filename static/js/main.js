requirejs.config({
    baseUrl: './static/js/',
    urlArgs: "cb=" + (new Date()).getTime(),
    paths: {
        jquery: './../bower_components/jquery/jquery',
        jsb: './../bower_components/jsb/jsb',
        Backbone: './../bower_components/backbone/backbone',
        underscore: './../bower_components/underscore/underscore',
        moment: './../bower_components/moment/min/moment-with-locales',
        bootstrap: './../bower_components/bootstrap/dist/js/bootstrap',
        json: './../bower_components/requirejs-plugins/src/json',
        text: './../bower_components/requirejs-plugins/lib/text'
    }
});

requirejs(['jquery', 'moment'], function($, moment) {
    function de__processRelativeTime(number, withoutSuffix, key, isFuture) {
        var format = {
            'm': ['eine Min.', 'einer Min.'],
            'h': ['eine Std.', 'einer Std.'],
            'd': ['ein Tag', 'einem Tag'],
            'dd': [number + ' Tage', number + ' Tagen'],
            'M': ['ein Monat', 'einem Monat'],
            'MM': [number + ' Monate', number + ' Monaten'],
            'y': ['ein Jahr', 'einem Jahr'],
            'yy': [number + ' Jahre', number + ' Jahren']
        };
        return withoutSuffix ? format[key][0] : format[key][1];
    }

    var de = moment.defineLocale('deShort', {
        months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
        monthsShort : 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
        weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
        weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
        weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
        longDateFormat : {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D. MMMM YYYY',
            LLL : 'D. MMMM YYYY LT',
            LLLL : 'dddd, D. MMMM YYYY LT'
        },
        calendar : {
            sameDay: '[Heute um] LT [Uhr]',
            sameElse: 'L',
            nextDay: '[Morgen um] LT [Uhr]',
            nextWeek: 'dddd [um] LT [Uhr]',
            lastDay: '[Gestern um] LT [Uhr]',
            lastWeek: '[letzten] dddd [um] LT [Uhr]'
        },
        relativeTime : {
            future : 'in %s',
            past : 'vor %s',
            s : 'ein paar Sek.',
            m : de__processRelativeTime,
            mm : '%d Min.',
            h : de__processRelativeTime,
            hh : '%d Std.',
            d : de__processRelativeTime,
            dd : de__processRelativeTime,
            M : de__processRelativeTime,
            MM : de__processRelativeTime,
            y : de__processRelativeTime,
            yy : de__processRelativeTime
        },
        ordinalParse: /\d{1,2}\./,
        ordinal : '%d.',
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });

    moment.locale('deShort');

    require(['bootstrap'], function() {
        require(['jsb'], function() {
            jsb.applyBehaviour(document.body);
        });
    });
});