define('domain/NewsItem', ['moment'], function(moment) {
    var NewsItem = function(data) {
        this.data = data;
        console.log('NewsItem', this.data);
    };

    NewsItem.prototype.getTitle = function() {
        return this.data.title;
    };

    NewsItem.prototype.getImageSrc = function() {
        return this.data.imageSrc;
    };

    NewsItem.prototype.getPublishedTimestamp = function() {
        return this.data.publishedTimestamp;
    };

    return NewsItem;
});