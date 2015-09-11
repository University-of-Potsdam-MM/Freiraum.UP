define('domain/Journey', ['moment'], function(moment) {
    var Journey = function(data) {
        this.data = data;
    };

    Journey.prototype.getName = function() {
        return this.data.name;
    };

    Journey.prototype.getCategory = function() {
        return this.data.category;
    };

    Journey.prototype.getPlatform = function() {
        return this.data.platform;
    };

    Journey.prototype.getStationName = function() {
        return this.data.stationName;
    };

    Journey.prototype.getDirection = function() {
        return this.data.direction;
    };

    Journey.prototype.getTime = function() {
        return this.data.time;
    };

    Journey.prototype.getTimeFormatted = function() {
        return moment(this.getTime()).format('HH:mm');
    };

    Journey.prototype.getTimeTo = function() {
        return moment().to(this.getTime(), false);
    };

    return Journey;
});