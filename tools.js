/*
 * Fade and overlay tools
 */

window.tools = {};
var ANIMATIONTIME = 3000;

tools.wrapText = function(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x + (maxWidth - context.measureText(line).width) / 2, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line, x + (maxWidth - context.measureText(line).width) / 2, y);
};

/* overlay currently fading in or fading out */
tools._fader = function(overlay, starttime, endtime, fading, ondonecb) {
  var progress;
  var elapsed;
  var opacity;

  // compute progress and cap it
  progress = parseFloat((new Date()).getTime() - starttime) / (endtime - starttime);
  progress = Math.min(progress, 1.0);
  if (fading) {
    opacity = progress;
  } else {
    opacity = 1 - progress;
  }

  overlay.setOpacity(opacity);

  if (progress < 1) {
    requestAnimationFrame(function() {
      tools._fader(overlay, starttime, endtime, fading, ondonecb);
    });
  } else {
    if (!fading) {
      overlay.setVisible(false);
    }
    ondonecb(overlay);
  }
};

tools.showOverlay = function(overlay) {
  overlay.setOpacity(1);
  overlay.setVisible(true);
};

tools.fadein = function(overlay, ondonecb) {
  tools.showOverlay(overlay);
  now = (new Date()).getTime();
  this._fader(overlay, now, now + ANIMATIONTIME, true, ondonecb);
};

tools.fadeout = function(overlay, ondonecb) {
  overlay.setOpacity(1);
  overlay.setVisible(true);
  now = (new Date()).getTime();
  this._fader(overlay, now, now + ANIMATIONTIME, false, ondonecb);
};
