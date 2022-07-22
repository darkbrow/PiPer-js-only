// ==UserScript==
// @name         Fixed to be able to see youtube subtitles in pip window. (Safari only)
// @namespace    https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main
// @homepage     https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main
// @version      1.0.1
// @encoding     utf-8
// @description  Fixed to be able to see youtube subtitles in pip window. This script is blatantly copied from amarcu5's good safari extension PiPer(https://github.com/amarcu5/PiPer.git).
// @icon         https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/toolbar/icon.png
// @author       amarcu5
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @compatible   safari
// @downloadURL  https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-readable/scripts/fix.js
// @updateURL    https://raw.githubusercontent.com/darkbrow/PiPer-js-only/main/js-readable/scripts/fix.js
// @grant        GM.xmlHttpRequest
// @connect      youtube.com
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

var a;a||(a=!0,(()=>{// Input 0
const LOGGING_LEVEL$$module$defines = 0;
const BROWSER$$module$defines = 0;
var module$defines = {};
module$defines.BROWSER = BROWSER$$module$defines;
module$defines.LOGGING_LEVEL = LOGGING_LEVEL$$module$defines;
// Input 1
const loggingPrefix$$module$logger = "[PiPer] ";
const LoggingLevel$$module$logger = {ALL:0, TRACE:10, INFO:20, WARNING:30, ERROR:40,};
const trace$$module$logger = LoggingLevel$$module$logger.TRACE >= LOGGING_LEVEL$$module$defines ? console.trace.bind(console) : function() {
};
const info$$module$logger = LoggingLevel$$module$logger.INFO >= LOGGING_LEVEL$$module$defines ? console.info.bind(console, loggingPrefix$$module$logger) : function() {
};
const warn$$module$logger = LoggingLevel$$module$logger.WARNING >= LOGGING_LEVEL$$module$defines ? console.warn.bind(console, loggingPrefix$$module$logger) : function() {
};
const error$$module$logger = LoggingLevel$$module$logger.ERROR >= LOGGING_LEVEL$$module$defines ? console.error.bind(console, loggingPrefix$$module$logger) : function() {
};
var module$logger = {};
module$logger.LoggingLevel = LoggingLevel$$module$logger;
module$logger.error = error$$module$logger;
module$logger.info = info$$module$logger;
module$logger.trace = trace$$module$logger;
module$logger.warn = warn$$module$logger;
// Input 2
const Browser$$module$common = {UNKNOWN:0, SAFARI:1, CHROME:2,};
const getBrowser$$module$common = function() {
  if (BROWSER$$module$defines != Browser$$module$common.UNKNOWN) {
    return BROWSER$$module$defines;
  }
  if (/Safari/.test(navigator.userAgent) && /Apple/.test(navigator.vendor)) {
    return Browser$$module$common.SAFARI;
  }
  if (/Chrome/.test(navigator.userAgent) && /Google/.test(navigator.vendor)) {
    return Browser$$module$common.CHROME;
  }
  return Browser$$module$common.UNKNOWN;
};
let PiperResource$$module$common;
let currentResource$$module$common = null;
const getResource$$module$common = function() {
  return currentResource$$module$common;
};
const setResource$$module$common = function(resource) {
  currentResource$$module$common = resource;
};
const getExtensionURL$$module$common = function(path) {
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      return safari.extension.baseURI + path;
    case Browser$$module$common.CHROME:
      return chrome.runtime.getURL(path);
    case Browser$$module$common.UNKNOWN:
    default:
      return path;
  }
};
const bypassBackgroundTimerThrottling$$module$common = function() {
  if (!currentResource$$module$common.captionElement) {
    warn$$module$logger("Unnecessary bypassing of background timer throttling on page without caption support");
  }
  const request = new XMLHttpRequest();
  request.open("GET", getExtensionURL$$module$common("scripts/fix.js"));
  request.onload = function() {
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.appendChild(document.createTextNode(request.responseText));
    document.head.appendChild(script);
  };
  request.send();
};
var module$common = {};
module$common.Browser = Browser$$module$common;
module$common.bypassBackgroundTimerThrottling = bypassBackgroundTimerThrottling$$module$common;
module$common.getBrowser = getBrowser$$module$common;
module$common.getExtensionURL = getExtensionURL$$module$common;
module$common.getResource = getResource$$module$common;
module$common.setResource = setResource$$module$common;
// Input 3
const CHROME_PLAYING_PIP_ATTRIBUTE$$module$video = "data-playing-picture-in-picture";
const eventListeners$$module$video = [];
const togglePictureInPicture$$module$video = function(video) {
  const playingPictureInPicture = videoPlayingPictureInPicture$$module$video(video);
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      if (playingPictureInPicture) {
        video.webkitSetPresentationMode("inline");
      } else {
        video.webkitSetPresentationMode("picture-in-picture");
      }
      break;
    case Browser$$module$common.CHROME:
      if (playingPictureInPicture) {
        const script = document.createElement("script");
        script.textContent = "document.exitPictureInPicture()";
        document.head.appendChild(script);
        script.remove();
      } else {
        video.removeAttribute("disablepictureinpicture");
        video.requestPictureInPicture();
      }
      break;
    case Browser$$module$common.UNKNOWN:
    default:
      break;
  }
};
const addPictureInPictureEventListener$$module$video = function(listener) {
  const index = eventListeners$$module$video.indexOf(listener);
  if (index == -1) {
    eventListeners$$module$video.push(listener);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    document.addEventListener("webkitpresentationmodechanged", videoPresentationModeChanged$$module$video, {capture:true,});
  }
};
const removePictureInPictureEventListener$$module$video = function(listener) {
  const index = eventListeners$$module$video.indexOf(listener);
  if (index > -1) {
    eventListeners$$module$video.splice(index, 1);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI && eventListeners$$module$video.length == 0) {
    document.removeEventListener("webkitpresentationmodechanged", videoPresentationModeChanged$$module$video);
  }
};
const dispatchPictureInPictureEvent$$module$video = function(video) {
  const expectedVideo = getResource$$module$common().videoElement(true);
  if (video != expectedVideo) {
    return;
  }
  const isPlayingPictureInPicture = videoPlayingPictureInPicture$$module$video(video);
  if (isPlayingPictureInPicture) {
    info$$module$logger("Video entering Picture in Picture mode");
  } else {
    info$$module$logger("Video leaving Picture in Picture mode");
  }
  const eventListenersCopy = eventListeners$$module$video.slice();
  for (let listener; listener = eventListenersCopy.pop();) {
    listener(video, isPlayingPictureInPicture);
  }
};
const videoPresentationModeChanged$$module$video = function(event) {
  const video = event.target;
  dispatchPictureInPictureEvent$$module$video(video);
};
const videoPlayingPictureInPicture$$module$video = function(video) {
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      return video.webkitPresentationMode == "picture-in-picture";
    case Browser$$module$common.CHROME:
      return video.hasAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video);
    case Browser$$module$common.UNKNOWN:
    default:
      return false;
  }
};
const videoDidEnterPictureInPicture$$module$video = function(event) {
  const video = event.target;
  video.setAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video, true);
  dispatchPictureInPictureEvent$$module$video(video);
  video.addEventListener("leavepictureinpicture", function(event) {
    video.removeAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video);
    dispatchPictureInPictureEvent$$module$video(video);
  }, {once:true});
};
const addVideoElementListeners$$module$video = function() {
  const elements = document.getElementsByTagName("video");
  for (let index = 0, element; element = elements[index]; index++) {
    element.addEventListener("enterpictureinpicture", videoDidEnterPictureInPicture$$module$video);
  }
};
var module$video = {};
module$video.addPictureInPictureEventListener = addPictureInPictureEventListener$$module$video;
module$video.addVideoElementListeners = addVideoElementListeners$$module$video;
module$video.removePictureInPictureEventListener = removePictureInPictureEventListener$$module$video;
module$video.togglePictureInPicture = togglePictureInPicture$$module$video;
module$video.videoPlayingPictureInPicture = videoPlayingPictureInPicture$$module$video;
// Input 4
let activeVideo$$module$fix = null;
let timeoutId$$module$fix = 0;
let timeouts$$module$fix = {};
const requests$$module$fix = [];
const callbacks$$module$fix = [];
const originalSetTimeout$$module$fix = window.setTimeout;
const originalClearTimeout$$module$fix = window.clearTimeout;
const originalRequestAnimationFrame$$module$fix = window.requestAnimationFrame;
const trackAnimationFrameRequest$$module$fix = function(callback) {
  let request = 0;
  if (!activeVideo$$module$fix) {
    request = originalRequestAnimationFrame$$module$fix(callback);
    requests$$module$fix.push(request);
  }
  callbacks$$module$fix.push(callback);
  return request;
};
window.requestAnimationFrame = trackAnimationFrameRequest$$module$fix;
const clearAnimationFrameRequests$$module$fix = function() {
  requests$$module$fix.length = 0;
  callbacks$$module$fix.length = 0;
  originalRequestAnimationFrame$$module$fix(clearAnimationFrameRequests$$module$fix);
};
clearAnimationFrameRequests$$module$fix();
const callAnimationFrameRequestsAndTimeouts$$module$fix = function() {
  const callbacksCopy = callbacks$$module$fix.slice();
  callbacks$$module$fix.length = 0;
  const timestamp = window.performance.now();
  for (let callback; callback = callbacksCopy.pop();) {
    callback(timestamp);
  }
  const timeoutsCopy = timeouts$$module$fix;
  timeouts$$module$fix = {};
  for (let id in timeoutsCopy) {
    let timeout = timeoutsCopy[id];
    if (timeout[0] <= timestamp) {
      if (typeof timeout[1] == "function") {
        timeout[1]();
      } else {
        eval(timeout[1]);
      }
    } else {
      timeouts$$module$fix[id] = timeout;
    }
  }
};
const unthrottledSetTimeout$$module$fix = function(callback, timeout) {
  const id = timeoutId$$module$fix++;
  timeouts$$module$fix[id.toString()] = [window.performance.now() + (timeout || 0), callback];
  return id;
};
const unthrottledClearTimeout$$module$fix = function(id) {
  if (id) {
    delete timeouts$$module$fix[id.toString()];
  }
};
const bypassBackgroundTimerThrottling$$module$fix = function() {
  if (document.hidden) {
    const allVideos = document.querySelectorAll("video");
    for (let videoId = allVideos.length; videoId--;) {
      const video = allVideos[videoId];
      if (videoPlayingPictureInPicture$$module$video(video)) {
        activeVideo$$module$fix = video;
        break;
      }
    }
    if (!activeVideo$$module$fix) {
      return;
    }
    for (let request; request = requests$$module$fix.pop();) {
      window.cancelAnimationFrame(request);
    }
    window.setTimeout = unthrottledSetTimeout$$module$fix;
    window.clearTimeout = unthrottledClearTimeout$$module$fix;
    activeVideo$$module$fix.addEventListener("timeupdate", callAnimationFrameRequestsAndTimeouts$$module$fix);
    info$$module$logger("Bypassing background timer throttling");
  } else if (activeVideo$$module$fix) {
    info$$module$logger("Finished bypassing background timer throttling");
    window.setTimeout = originalSetTimeout$$module$fix;
    window.clearTimeout = originalClearTimeout$$module$fix;
    activeVideo$$module$fix.removeEventListener("timeupdate", callAnimationFrameRequestsAndTimeouts$$module$fix);
    activeVideo$$module$fix = null;
    for (let callbackId = callbacks$$module$fix.length; callbackId--;) {
      let request = originalRequestAnimationFrame$$module$fix(callbacks$$module$fix[callbackId]);
      requests$$module$fix.push(request);
    }
    const timestamp = window.performance.now();
    for (let id in timeouts$$module$fix) {
      let timeout = timeouts$$module$fix[id];
      originalSetTimeout$$module$fix(timeout[1], timeout[0] - timestamp);
    }
    timeouts$$module$fix = {};
  }
};
document.addEventListener("visibilitychange", bypassBackgroundTimerThrottling$$module$fix);
var module$fix = {};
})());
