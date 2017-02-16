
/*
Band Clock is a jquery plugin to display a dynamic band clock.

Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

Built on top of the jQuery library (http://jquery.com)

@source: http://github.com/zaniitiin/band-clock/
@autor: Nitin Jha
@version: 1.0
 */

(function() {
  'use strict';
  (function($) {
    $.bandClock = function(el, options) {
      var degToRed, renderTime;
      this.el = el;
      this.$el = $(el);
      this.$el.data('bandClock', this);
      this.init = (function(_this) {
        return function() {
          var _x, scaleBy;
          _this.options = $.extend({}, $.bandClock.defaultOptions, options);
          _this.canvas = $("<canvas width='" + _this.options.size + "' height='" + _this.options.size + "' ></canvas>").get(0);
          _this.$el.append(_this.canvas);
          _this.ctx = _this.canvas.getContext('2d');
          if (window.devicePixelRatio > 1) {
            scaleBy = window.devicePixelRatio;
            $(_this.canvas).css({
              width: _this.options.size,
              height: _this.options.size
            });
            _this.canvas.width *= scaleBy;
            _this.canvas.height *= scaleBy;
            _this.ctx.scale(scaleBy, scaleBy);
          }
          _this.$el.addClass('bandClock');
          _this.$el.css({
            width: _this.options.size,
            height: _this.options.size,
            lineHeight: _this.options.size + "px"
          });
          _x = _this.options.size / 2;
          _this.ctx.translate(_x, _x);
          _this.ctx.shadowBlur = 2;
          _this.ctx.shadowColor = _this.options.color;
          return _this;
        };
      })(this);
      degToRed = function(degree) {
        var factor;
        factor = Math.PI / 180;
        return degree * factor;
      };
      renderTime = (function(_this) {
        return function() {
          var _g, _r, _r1, _r2, _x, hours, milliseconds, minutes, newSeconds, now, seconds, time;
          _x = _this.options.size / 2;
          _g = _this.options.gap;
          _r = _x - (_this.options.lineWidth);
          _r1 = _r - (_g + _this.options.lineWidth);
          _r2 = _r1 - (_g + _this.options.lineWidth);
          _this.ctx.fillStyle = _this.options.bgColor;
          _this.ctx.fillRect(-_x, -_x, _this.options.size, _this.options.size);
          _this.ctx.strokeStyle = _this.options.strokeColor;
          _this.ctx.lineWidth = _this.options.lineWidth;
          _this.ctx.lineCap = _this.options.lineCap;
          now = new Date();
          hours = now.getHours();
          minutes = now.getMinutes();
          seconds = now.getSeconds();
          milliseconds = now.getMilliseconds();
          newSeconds = seconds + (milliseconds / 1000);
          time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          /*
          _this.ctx.beginPath();
          _this.ctx.arc(0, 0, _r, degToRed(270), degToRed((hours * 30) - 90));
          _this.ctx.stroke();
          _this.ctx.beginPath();
          _this.ctx.arc(0, 0, _r1, degToRed(270), degToRed((minutes * 6) - 90));
          _this.ctx.stroke();

          _this.ctx.beginPath();
          _this.ctx.arc(0, 0, _r2, degToRed(270), degToRed((newSeconds * 6) - 90));
          _this.ctx.stroke();
          */
          _this.ctx.beginPath();
          _this.ctx.arc(0, 0, _r, degToRed(270), degToRed((newSeconds * 6) - 90));
          _this.ctx.stroke();
          _this.ctx.font = _this.options.fontStyle;
          _this.ctx.fillStyle = _this.options.color;
          _this.ctx.textAlign = "center";
          _this.ctx.fillText(time, 0, 10);
          return _this;
        };
      })(this);
      setInterval(renderTime, 40);
      return this.init();
    };
    $.bandClock.defaultOptions = {
      size: 300,
      color: '#18FFFF',
      strokeColor: '#014260',
      bgColor: '#212121',
      lineWidth: 10,
      lineCap: 'butt',
      gap: 5,
      fontStyle: '20px Verdana'
    };
    return $.fn.bandClock = function(options) {
      $.each(this, function(i, el) {
        var $el, instanceOptions;
        $el = $(el);
        if (!$el.data('bandClock')) {
          instanceOptions = $.extend({}, options, $el.data());
          return $el.data('bandClock', new $.bandClock(el, instanceOptions));
        }
      });
      return void 0;
    };
  })(jQuery);

}).call(this);