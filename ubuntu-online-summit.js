/*
 * Main script and hangout orchestrator
 */

var startOverlay = null;
var sessionTitleOverlay = null;

var config = {};

function onYoutubeLiveReady(youtubeLiveId) {
  document.querySelector('#youtube-url').innerHTML = youtubeLiveId.youTubeLiveId;

  // TODO: send all data to the server (broadcast url, hangout url, token)

  gapi.hangout.onair.onBroadcastingChanged.add(changeBroadcastingState);

  // We switch the main participant mirror now to avoid surprises
  gapi.hangout.av.setLocalParticipantVideoMirrored(false);

  // TODO: remove, only for debugging purposes
  document.querySelector('#start').addEventListener('click', function() { changeBroadcastingState(true); });
}

function changeBroadcastingState(isBroadCasting) {
  if (isBroadCasting) {
    gapi.hangout.onair.setDisplayedParticipantInBroadcast(gapi.hangout.getLocalParticipant().id);

    // show main overlay and wait 10s before fading out
    tools.showOverlay(startOverlay);

    /* play music
     * we can't use the google hangout API for it as it doesn't work as of now with urls. It only supports wav data uri)
     */
    document.querySelector('#introMusic').play();

    // fadein intro overlay after 5 seconds
    window.setTimeout(function() {
      tools.fadein(sessionTitleOverlay, function() {});
    }, 5000);

    window.setTimeout(startEndIntro, 10000);
  }

  // TODO: delay end broadcast and show up outtro? (if API let us doing that)
}

/* fade out all intro overlays before disposing */
function startEndIntro() {
  tools.fadeout(sessionTitleOverlay, freeOverlay);
  tools.fadeout(startOverlay, introDone);
}

/* restore to normal on air state and request intro overlay freeing */
function introDone(overlay) {
  // return for local participant to the expected mirroring status
  gapi.hangout.av.setLocalParticipantVideoMirrored(true);
  gapi.hangout.onair.clearDisplayedParticipantInBroadcast();
  freeOverlay(overlay);
}

function init() {
  gapi.hangout.onApiReady.add(
    function(eventObj) {
      if (eventObj.isApiReady) {
        // add all functionalities to the broadcaster as he's the one who will set everything and starts the video
        if (!gapi.hangout.getLocalParticipant().isBroadcaster) {
          return;
        }

        config = JSON.parse(gapi.hangout.getStartData()) || {
          token: 'example_token',
          event_title: 'Ubuntu Online Summit Nov 2015',
          irc_chan: '#ubuntu-uos-desktop',
          hangout_topic: 'Update to bluez 5.1',
          end_tagline: 'visit us at http://summit.ubuntu.com',
        };
        document.getElementById('token').innerHTML = config;
        document.getElementById('ho-url').innerHTML = gapi.hangout.getHangoutUrl();
        gapi.hangout.onair.onYouTubeLiveIdReady.add(onYoutubeLiveReady);

        // create start overlays
        startOverlay = createStartOverlay(config.event_title);
        /* we can't use gapi.hangout.getTopic() which will work even if the user changed the topic as the API returns
           nothing (https://code.google.com/p/google-plus-platform/issues/detail?id=956).
           Use the parameter then. */
        sessionTitleOverlay = createSessionOverlay(config.hangout_topic, config.irc_chan);
      }
    });
}

// Wait for gadget to load.
gadgets.util.registerOnLoadHandler(init);
