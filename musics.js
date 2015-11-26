/*
 * Hangouts API 1.3 seems to only accept sound as data uri. It doesn't work (even when loading wav over https)
 * when an url is passed. We even don't receive the "onLoad" signal for those.
 * Handover then inline loaded musics.
 */


function loadIntroMusic() {
  return gapi.hangout.av.effects.createAudioResource(_INTROMUSIC);
}
