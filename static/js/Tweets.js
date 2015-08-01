define('Tweets', ['jquery', "json!../../config.json"], function($, config) {

    var Tweets = function(domElement, options) {
        var that = this;
        this.domElement = $(domElement);
        this.domElement.find('.js_twitter_timeline').attr('data-widget-id', config.twitter_widget_id);
        this.domElement.find('.js_twitter_timeline').attr('width', Math.min(window.innerWidth, 520));
        if (!document.getElementById('twitter-wjs')) {
            !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
        }
    };

    return Tweets;
});