define('domain/NewsItem', ['moment'], function(moment) {
    var NewsItem = function(data) {
        this.data = data;
    };

    NewsItem.prototype.getTitle = function() {
        return this.data.title;
    };

    NewsItem.prototype.getContent = function() {
        return this.data.content;
    };

    NewsItem.prototype.getImageSrc = function() {
        return this.data.imageSrc;
    };

    NewsItem.prototype.getPublishedTimestamp = function() {
        return this.data.publishedTimestamp;
    };

    NewsItem.prototype.getUpdatedTimestamp = function() {
        return this.data.updatedTimestamp;
    };

    NewsItem.prototype.hasLocation = function() {
        return this.getContent().match(/^(.+), (.+) - /) ? true : false;
    };

    NewsItem.prototype.getMainLocation = function() {
        var match = this.getContent().match(/^(.+?), (.+?) - /);
        return match && match[1];
    };

    NewsItem.prototype.getLocation = function() {
        var match = this.getContent().match(/^(.+?), (.+?) - /);
        console.log('match', match);
        return match && match[2];
    };

    return NewsItem;
});