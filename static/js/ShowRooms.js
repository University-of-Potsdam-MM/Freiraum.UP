define('ShowRooms', ["jquery", "json!../../config.json", "moment"], function ($, config, moment)
{
    "use strict"

    var FreeRoom = function(campus, house, room)
    {
        this.campus = campus;
        this.house = house;
        this.room = room;
    };

    FreeRoom.prototype.getRoom = function ()
    {
        return this.room;
    }

    var Reservation = function(name, start_time, end_time, campus, house, room, person_name)
    {
        this.name = name.replace(/.+?\/.+? - /, '').replace(/ (I+)[: ].+$/, ' $1');
        this.start_time = start_time;
        this.end_time = end_time;
        this.campus = campus;
        this.house = house;
        this.room = room;
        this.person_name = person_name;
    };

    Reservation.prototype.getName = function()
    {
        return this.name;
    };

    Reservation.prototype.getShortCode = function()
    {
        var name_without_latin_numbers = this.name.replace(/ I+$/, "");
        var latin_numbers_suffix = this.name.match(/ I+$/) || "";

        return (" " + name_without_latin_numbers).match(/ [a-zA-Z]/g).join('').replace(/ /g, '') + latin_numbers_suffix;
    };

    Reservation.prototype.getRoom = function ()
    {
        return this.room;
    }

    Reservation.prototype.getShortPersonName = function ()
    {
        var short_person_name = this.person_name.replace(/(Dr. |Prof.)/g, '');
        short_person_name = short_person_name.match(/[A-Z]/g).join('.') + '.';

        if (!short_person_name)
        {
            short_person_name = 'N.N';
        }

        return short_person_name;
    }

    Reservation.prototype.getStartTime = function()
    {
        return this.start_time;
    };

    Reservation.prototype.getStartTimeAsTimeString = function()
    {
        return this.getDateAsTimeString(this.getStartTime());
    };

    Reservation.prototype.getEndTime = function()
    {
        return this.end_time;
    };

    Reservation.prototype.getEndTimeAsTimeString = function()
    {
        return this.getDateAsTimeString(this.getEndTime());
    };

    Reservation.prototype.getDateAsTimeString = function(date)
    {
        var hours = date.getHours();
        var minutes = date.getMinutes();

        if (hours < 10)
        {
            hours = "0" + hours;
        }

        if (minutes < 10)
        {
            minutes = "0" + minutes;
        }

        return hours + ':' + minutes;
    };

    Reservation.prototype.isRunningAtTime = function(time)
    {
        if (this.getStartTime().getTime() <= time.getTime() && time.getTime() < this.getEndTime().getTime())
        {
            return true;
        }

        return false;
    };

    var ShowRooms = function (dom_element, options)
    {
        var that = this;

        this.options = options || {};
        this.dom_element = $(dom_element);
        this.now_tbody_element = this.dom_element.find('.js_now_body');
        this.soon_tbody_element = this.dom_element.find('.js_soon_body');
        this.free_ul_element = this.dom_element.find('.js_free_rooms');
        this.base_url = config.use_xml_proxy > 0 ? 'xml.php/' : config.base_url.toString();
        this.authorization = config.authorization.toString();
        this.reservations = [];
        this.free_rooms = [];

        this.campus = config.campus;
        this.house = config.house;
        this.now = null;

        var house_match = document.location.toString().match(/house=([^&$]+)/);
        if (house_match)
        {
            this.house = decodeURIComponent(house_match[1]);
        }
        var campus_match = document.location.toString().match(/campus=([^&$]+)/);
        if (campus_match)
        {
            this.campus = decodeURIComponent(campus_match[1]);
        }
        this.refreshNowValue();
        this.refreshReservations();

        $('.js_app_title').text('Campus ' + this.campus + ', Haus ' + this.house);
        window.title = $('.js_app_title').text();

        $('.js_campus').val(that.campus);
        $('.js_house').val(that.house);

        setInterval(function() {
            that.refreshNowValue();
            that.refreshReservations();
        }, config.rooms_update_frequency * 1000);

        jsb.on('LocalTraffic::NEXT_JOURNEYS', function(journeys) {

            var journeysText = [];
            var firstForCategoryMap = {};
            journeys.forEach(function(journey) {
               if (!firstForCategoryMap[journey.getName()]) {
                   firstForCategoryMap[journey.getName()] = journey;
               }
            });

            var count = 0;

            for (var name in firstForCategoryMap) {
                if (firstForCategoryMap.hasOwnProperty(name)) {
                    if (count < config.local_traffic_count) {
                        count++;
                        journeysText.push(name + ' ' + moment().to(firstForCategoryMap[name].getTime()));
                    }
                }
            }

            $('.js_next_local_traffic').text('ÖPNV: ' + journeysText.join(', '));
        });

        jsb.on('LocalTraffic::NO_NEXT_JOURNEYS', function() {
            $('.js_next_local_traffic').text('');
        });
    };

    ShowRooms.prototype.logDebug = function()
    {
        if (typeof console !== 'undefined' && typeof console.log === 'function')
        {
            console.log.apply(console, arguments);
        }
        else
        {
            /* We cannot log properly, so we don't even try! */
        }
    };

    ShowRooms.prototype.refreshNowValue = function()
    {
        this.now = new Date();

        var now_match = document.location.toString().match(/now=([^&$]+)/);
        if (now_match)
        {
            this.now = new Date(decodeURIComponent(now_match[1]));
        }

        this.now.setHours(Math.floor(this.now.getHours() / 2) * 2);
        this.now.setMinutes(0);
        this.now.setSeconds(0);
    }

    ShowRooms.prototype.refreshReservations = function()
    {
        var that = this;

        var soon = new Date();
        soon.setTime(this.now.getTime() + 2 * 60 * 60 * 1000);
        var end_of_soon = new Date();
        end_of_soon.setTime(soon.getTime() + 2 * 60 * 60 * 1000);

        $('.js_now_headline').text('Jetzt (' + this.now.toLocaleTimeString().replace(/:\d\d$/g, '') + ' - ' + soon.toLocaleTimeString().replace(/:\d\d$/g, '') + ' Uhr)');
        $('.js_soon_headline').text('Demnächst (ab ' + soon.toLocaleTimeString().replace(/:\d\d$/g, '') + ' Uhr)');

        that.logDebug('ShowRooms:refreshReservations', that.base_url + 'reservations');

        $.ajax({
            'url': that.base_url + 'reservations',
            headers: {
                'Authorization': that.authorization
            },
            'data': {
                // FIXME: hack to retrieve all data, since the date is not filtered properly, yet
                'endTime': end_of_soon.toISOString(),
                'startTime': that.now.toISOString(),
                'campus': that.campus,
                'cb': Math.random()
            },
            'dataType': 'xml'
        }).fail(function(response) {
            that.logDebug('fail reservations', response);

        }).done(function (response) {
            var returns = $(response).find('return');

            // FIXME: hack to store used_rooms
            var used_rooms = [];

            that.clearReservations();
            returns.each(function(pos, reservation_raw) {
                reservation_raw = $(reservation_raw);
                var reservation = that.addReservation(reservation_raw.find('veranstaltung').text(), reservation_raw.find('startTime').text(), reservation_raw.find('endTime').text(), reservation_raw.find('roomList > room').text(), reservation_raw.find('personList > person:first').text());
                // FIXME: hack to mark all used rooms
                if (reservation && reservation.isRunningAtTime(that.now))
                {
                    used_rooms.push(reservation_raw.find('roomList > room').text());
                }
            });

            that.sortReservationsByRoomName();
            that.renderAllReservations();

            that.logDebug('ShowRooms:refreshReservations', that.base_url + 'rooms4Time');
            $.ajax({
                'url':  that.base_url + 'rooms4Time',
                headers: {
                    'Authorization': that.authorization
                },
                'data': {
                    // FIXME: rausnehmen, sobald die filterlogik funktioniert
                    'endTime': that.now.toISOString(),
                    'startTime': that.now.toISOString(),
                    'campus': that.campus,
                    'cb': Math.random()
                },
                'dataType': 'xml'
            }).fail(function(response) {
                that.logDebug('fail rooms4time', response);

            }).done(function (response) {
                var returns = $(response).find('return');

                that.clearFreeRooms();

                returns.each(function(pos, reservation_raw) {
                    reservation_raw = $(reservation_raw);
                    // FIXME: rausnehmen, sobald die filterlogik bei rooms4Time richtig funktioniert
                    if (used_rooms.indexOf(reservation_raw.text()) == -1)
                    {
                        that.addFreeRoom(reservation_raw.text());
                    }
                });

                that.sortFreeRoomsByName();
                that.renderAllFreeRooms();

            });
        });
    }

    ShowRooms.prototype.renderAllReservations = function()
    {
        var that = this;

        var now = new Date(this.now.toString());

        var soon = new Date();
        soon.setTime(now.getTime() + 2 * 60 * 60 * 1000);

        var before = new Date();
        before.setTime(now.getTime() - 2 * 60 * 60 * 1000);

        $('input.js_now').val(now.toISOString());
        $('input.js_soon').val(soon.toISOString());
        $('input.js_before').val(before.toISOString());

        that.now_tbody_element.empty();
        that.soon_tbody_element.empty();

        var running_count = 0;

        $.each(that.reservations, function(pos, reservation) {
            var is_running = reservation.isRunningAtTime(now);
            if (is_running)
            {
                running_count++;
                that.now_tbody_element.append(that.createDivForReservation(reservation, false, now));
            }
        });

        if (running_count == 0)
        {
            var div_element = $('<div />');
            that.dom_element.find('.js_reservations_now').addClass('is-hidden');
            div_element.addClass('alert alert-info');
            div_element.text('Keine Veranstaltungen');
            that.now_tbody_element.append(div_element);
        } else {
            that.dom_element.find('.js_reservations_now').removeClass('is-hidden');
        }

        running_count = 0;

        $.each(that.reservations, function(pos, reservation) {
            var is_running = reservation.isRunningAtTime(soon);

            if (is_running)
            {
                running_count++;
                that.soon_tbody_element.append(that.createDivForReservation(reservation, false, soon));
            }
        });

        if (running_count == 0)
        {
            var div_element = $('<div />');
            that.dom_element.find('.js_reservations_soon').addClass('is-hidden');
            div_element.addClass('alert alert-info');
            div_element.text('Keine Veranstaltungen');
            that.soon_tbody_element.append(div_element);
        } else {
            that.dom_element.find('.js_reservations_soon').removeClass('is-hidden');
        }
    };

    ShowRooms.prototype.createDivForReservation = function(reservation, highlight_first_letter, block_start_time)
    {
        var div_element = $(document.createElement('div'));
        var room_element = $(document.createElement('strong'));
        var info_element = $(document.createElement('span'));
        var person_element = $(document.createElement('span'));
        var time_element = $(document.createElement('span'));

        div_element.addClass('reservation');

        room_element.text(reservation.getRoom());
        room_element.addClass('pull-right');
        room_element.addClass('room');

        var text = reservation.getName();
        text = reservation.getShortCode();
        var strong_info = $('<strong />');
        strong_info.text(reservation.getName() + '' + ' ksjhdkadj klsjdlkasj dlaksjd aldjaslk jdalkdj laksdjasldjiwieulakhkasd asldakjhfda dhasd ,asjd alksjd aldkjasdlaksjdlajdska');
        strong_info.text(reservation.getName());

        info_element.append(strong_info);
        if (highlight_first_letter)
        {
            info_element.html( info_element.html().replace(/^(.)/, '<em>$1</em>'));
        }
        info_element.addClass('info');

        var is_time_visible = block_start_time.getTime() + 2 * 60 * 60 * 1000 != reservation.getEndTime().getTime() ? true : false;

        if (is_time_visible)
        {
            person_element.text('(' + reservation.getShortPersonName() + ', ');
            time_element.text(reservation.getStartTimeAsTimeString() + ' - ' + reservation.getEndTimeAsTimeString());
            time_element.text('bis ' + reservation.getEndTimeAsTimeString() + ')');
        }
        else
        {
            person_element.text('(' + reservation.getShortPersonName() + ')');
            time_element.text('');
        }
        person_element.addClass('person');
        time_element.addClass('time');
        div_element.append(room_element);
        div_element.append(info_element);
        info_element.append(person_element);
        info_element.append(time_element);

        return div_element;
    };

    ShowRooms.prototype.renderAllFreeRooms = function()
    {
        var that = this;

        that.free_ul_element.empty();

        $.each(that.free_rooms, function(pos, free_room) {
            var a_element = $(document.createElement('a'));
            a_element.addClass('btn');
            a_element.addClass('btn-success');

            var text = free_room.getRoom();
            a_element.text(text);
            a_element.css('margin', '3px');
            that.free_ul_element.append(a_element);
        });
    };

    ShowRooms.prototype.clearReservations = function()
    {
        this.reservations = [];
    };

    ShowRooms.prototype.addReservation = function(name, start_time, end_time, room_string, person_string)
    {
        var that = this;
        var room_match = room_string.match(/^([^\.]+)\.([^\.]+)\.(.+)/);

        if (name && room_match && name != 'Raumreservierung')
        {
            var campus = room_match[1];
            var house = parseInt(room_match[2], 10);
            var room = room_match[3];

            /* Because sometimes there double escaped XML entities in the response ... */
            name = $('<textarea/>').html(name).val();;


            if (campus == that.campus && house == that.house)
            {
                var reservation = new Reservation(name, new Date(start_time), new Date(end_time), campus, house, room, person_string);
                that.reservations.push(reservation);
                return reservation;
            }
        }
    };

    ShowRooms.prototype.clearFreeRooms = function()
    {
        this.free_rooms = [];
    };

    ShowRooms.prototype.addFreeRoom = function(room_string)
    {
        var that = this;
        var room_match = room_string.match(/^([^\.]+)\.([^\.]+)\.(.+)/);

        if (room_match)
        {
            var campus = room_match[1];
            var house = parseInt(room_match[2], 10);
            var room = room_match[3];

            if (campus == that.campus && house == that.house)
            {
                that.free_rooms.push(new FreeRoom(campus, house, room));
            }
        }
    };


    ShowRooms.prototype.sortReservationsByRoomName = function()
    {
        this.reservations.sort(function(a, b) {
            if (a.getRoom() == b.getRoom())
            {
                return 0;
            }

            var value = a.getRoom() > b.getRoom() ? 1 : -1;

            /* Put H0, H1, etc at the beginning */
            if (a.getRoom().substr(0, 1) == 'H' && b.getRoom().substr(0, 1) == 'H')
            {
                return value;
            }

            if (a.getRoom().substr(0, 1) == 'H' && b.getRoom().substr(0, 1) != 'H')
            {
                return -1;
            }

            if (a.getRoom().substr(0, 1) != 'H' && b.getRoom().substr(0, 1) == 'H')
            {
                return 1;
            }

            /* default behaviour, if we don't have a H-Room involved */

            return value;
        });
    };

    ShowRooms.prototype.sortReservationsByName = function()
    {
        this.reservations.sort(function(a, b) {
            return a.getName() == b.getName() ? 0 : (a.getName() > b.getName() ? 1 : -1);
            //return a.getRoom() == b.getRoom() ? 0 : (a.getRoom() > b.getRoom() ? 1 : -1);
        });
    };


    ShowRooms.prototype.sortFreeRoomsByName = function()
    {
        this.free_rooms.sort(function(a, b) {
            return a.getRoom() == b.getRoom() ? 0 : (a.getRoom() > b.getRoom() ? 1 : -1);
        });
    };

    return ShowRooms;
});
